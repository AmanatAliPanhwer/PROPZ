import { createPublicClient, createWalletClient, http, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy } from 'viem/chains';
import { CHAIN_ID } from './contract';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://polygon-amoy.g.alchemy.com/v2/demo';

export function getPublicClient() {
  return createPublicClient({
    chain: polygonAmoy,
    transport: http(RPC_URL),
  });
}

export function getWalletClient() {
  const pk = process.env.REWARDER_PRIVATE_KEY as `0x${string}` | undefined;
  if (!pk) return null;

  const account = privateKeyToAccount(pk);
  return createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http(RPC_URL),
  });
}

export function getAccount(): Address | null {
  const pk = process.env.REWARDER_PRIVATE_KEY as `0x${string}` | undefined;
  if (!pk) return null;
  return privateKeyToAccount(pk).address;
}
