import hre from 'hardhat';

async function main() {
  const tokenAddress = process.env.NEXT_PUBLIC_THANK_TOKEN;
  const rewardAddress = process.env.NEXT_PUBLIC_REWARD_CONTRACT;

  if (!tokenAddress || !rewardAddress) {
    console.error('Set NEXT_PUBLIC_THANK_TOKEN and NEXT_PUBLIC_REWARD_CONTRACT');
    process.exitCode = 1;
    return;
  }

  console.log('Verifying THANKToken at:', tokenAddress);
  try {
    await hre.run('verify:verify', {
      address: tokenAddress,
      constructorArguments: [process.env.REWARDER_PRIVATE_KEY ? '0x...placeholder' : '0x...placeholder', process.env.REWARDER_PRIVATE_KEY ? '0x...placeholder' : '0x...placeholder'],
    });
    console.log('THANKToken verified');
  } catch (e: unknown) {
    if (e instanceof Error) console.log('Already verified or error:', e.message);
  }

  console.log('Verifying ThankReward at:', rewardAddress);
  try {
    await hre.run('verify:verify', {
      address: rewardAddress,
      constructorArguments: [tokenAddress, process.env.REWARDER_PRIVATE_KEY ? '0x...placeholder' : '0x...placeholder'],
    });
    console.log('ThankReward verified');
  } catch (e: unknown) {
    if (e instanceof Error) console.log('Already verified or error:', e.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
