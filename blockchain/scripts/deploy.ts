import hre from 'hardhat';

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  // Deploy THANKToken
  const tokenFactory = await hre.ethers.getContractFactory('THANKToken');
  const token = await tokenFactory.deploy(deployer.address, deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log('THANKToken deployed to:', tokenAddress);

  // Deploy ThankReward
  const rewardFactory = await hre.ethers.getContractFactory('ThankReward');
  const reward = await rewardFactory.deploy(tokenAddress, deployer.address);
  await reward.waitForDeployment();
  const rewardAddress = await reward.getAddress();
  console.log('ThankReward deployed to:', rewardAddress);

  // Grant MINTER_ROLE on token to reward contract
  const MINTER_ROLE = await token.MINTER_ROLE();
  const grantTx = await token.grantRole(MINTER_ROLE, rewardAddress);
  await grantTx.wait();
  console.log('Granted MINTER_ROLE to ThankReward');

  console.log('\nDeployment complete!');
  console.log('THANKToken:', tokenAddress);
  console.log('ThankReward:', rewardAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
