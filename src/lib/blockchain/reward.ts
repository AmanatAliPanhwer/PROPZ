import { getContract } from 'viem';
import { prisma } from '@/lib/prisma';
import { THANK_REWARD_ABI, getContractAddresses } from './contract';
import { getPublicClient, getWalletClient, getAccount } from './client';

const BASE_REWARD = 10n * 10n ** 18n; // 10 THANK (18 decimals)
const MAX_TRUST_SCORE = 200;

export function calculateRewardAmount(trustScore: number): bigint {
  const capped = Math.min(trustScore, MAX_TRUST_SCORE);
  if (capped <= 0) return 0n;
  return (BASE_REWARD * BigInt(capped)) / 100n;
}

export async function issueReward(thankId: string, receiverId: string) {
  const addresses = getContractAddresses();
  if (!addresses.thankReward) {
    console.warn('[blockchain] THANK_REWARD_CONTRACT not configured — skipping reward');
    return null;
  }

  const walletClient = getWalletClient();
  if (!walletClient) {
    console.warn('[blockchain] REWARDER_PRIVATE_KEY not configured — skipping reward');
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!user) {
    console.warn(`[blockchain] User ${receiverId} not found — skipping reward`);
    return null;
  }

  if (!user.walletAddress) {
    console.warn(`[blockchain] User ${receiverId} has no wallet address — skipping reward`);
    return null;
  }

  const amount = calculateRewardAmount(user.trustScore);
  if (amount === 0n) {
    console.warn(`[blockchain] Reward amount is 0 for user ${receiverId} (trustScore: ${user.trustScore})`);
    return null;
  }

  try {
    const publicClient = getPublicClient();
    const account = getAccount();
    if (!account) {
      console.warn('[blockchain] No rewarder account available');
      return null;
    }

    const { request } = await publicClient.simulateContract({
      address: addresses.thankReward,
      abi: THANK_REWARD_ABI,
      functionName: 'rewardWorker',
      args: [user.walletAddress as `0x${string}`, BigInt(user.trustScore), thankId],
      account,
    });

    const txHash = await walletClient.writeContract(request);

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    await prisma.reward.create({
      data: {
        userId: receiverId,
        thankId,
        amount,
        txHash,
      },
    });

    console.log(`[blockchain] Reward issued: ${amount} THANK to ${user.walletAddress} (tx: ${txHash})`);

    return { amount, txHash };
  } catch (error) {
    console.error('[blockchain] Failed to issue reward:', error);
    return null;
  }
}

export async function getBalance(address: `0x${string}`): Promise<bigint | null> {
  const addresses = getContractAddresses();
  if (!addresses.thankToken) return null;

  try {
    const publicClient = getPublicClient();
    const contract = getContract({
      address: addresses.thankToken,
      abi: (await import('./contract')).THANK_TOKEN_ABI,
      client: publicClient,
    });
    const balance = await contract.read.balanceOf([address]);
    return balance as bigint;
  } catch (error) {
    console.error('[blockchain] Failed to fetch balance:', error);
    return null;
  }
}
