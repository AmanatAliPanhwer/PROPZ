import { expect } from 'chai';
import hre from 'hardhat';
import { type THANKToken, type ThankReward } from '../typechain-types';

describe('ThankReward', () => {
  let token: THANKToken;
  let reward: ThankReward;
  let owner: string;
  let worker: string;
  let attacker: string;

  const BASE_REWARD = 10n * 10n ** 18n;
  const TRUST_SCORE_100 = 100n;
  const TRUST_SCORE_150 = 150n;
  const TRUST_SCORE_0 = 0n;

  beforeEach(async () => {
    [owner, worker, attacker] = await hre.ethers.getSigners().then(s => s.map(a => a.address));

    const tokenFactory = await hre.ethers.getContractFactory('THANKToken');
    token = await tokenFactory.deploy(owner, owner);

    const rewardFactory = await hre.ethers.getContractFactory('ThankReward');
    reward = await rewardFactory.deploy(await token.getAddress(), owner);

    // Grant MINTER_ROLE on token to reward contract
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const tokenAsOwner = token.connect(ownerSigner);
    await tokenAsOwner.grantRole(await token.MINTER_ROLE(), await reward.getAddress());
  });

  it('should reward worker with trust score 100 (base reward)', async () => {
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const rewardAsOwner = reward.connect(ownerSigner);
    await rewardAsOwner.rewardWorker(worker, TRUST_SCORE_100, 'thank-1');
    const balance = await token.balanceOf(worker);
    expect(balance).to.equal(BASE_REWARD);
  });

  it('should scale reward by trust score (score 150 = 1.5x)', async () => {
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const rewardAsOwner = reward.connect(ownerSigner);
    await rewardAsOwner.rewardWorker(worker, TRUST_SCORE_150, 'thank-2');
    const balance = await token.balanceOf(worker);
    const expected = (BASE_REWARD * 150n) / 100n;
    expect(balance).to.equal(expected);
  });

  it('should not reward with trust score 0 (amount would be zero)', async () => {
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const rewardAsOwner = reward.connect(ownerSigner);
    await expect(
      rewardAsOwner.rewardWorker(worker, TRUST_SCORE_0, 'thank-3')
    ).to.be.revertedWith('Reward amount is zero');
  });

  it('should emit WorkerRewarded event', async () => {
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const rewardAsOwner = reward.connect(ownerSigner);
    await expect(rewardAsOwner.rewardWorker(worker, TRUST_SCORE_100, 'thank-4'))
      .to.emit(reward, 'WorkerRewarded')
      .withArgs(worker, BASE_REWARD, TRUST_SCORE_100, 'thank-4');
  });

  it('should not allow non-REWARDER_ROLE to call rewardWorker', async () => {
    const signers = await hre.ethers.getSigners();
    const attackerSigner = signers.find(s => s.address === attacker)!;
    const rewardAsAttacker = reward.connect(attackerSigner);
    await expect(
      rewardAsAttacker.rewardWorker(worker, TRUST_SCORE_100, 'thank-5')
    ).to.be.reverted;
  });

  it('should pause and unpause rewards', async () => {
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const rewardAsOwner = reward.connect(ownerSigner);

    await rewardAsOwner.pause();
    await expect(
      rewardAsOwner.rewardWorker(worker, TRUST_SCORE_100, 'thank-6')
    ).to.be.reverted;

    await rewardAsOwner.unpause();
    await rewardAsOwner.rewardWorker(worker, TRUST_SCORE_100, 'thank-7');
    expect(await token.balanceOf(worker)).to.equal(BASE_REWARD);
  });

  it('should allow default admin to update base reward', async () => {
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const rewardAsOwner = reward.connect(ownerSigner);

    const newBase = 20n * 10n ** 18n;
    await rewardAsOwner.setBaseReward(newBase);
    expect(await reward.baseReward()).to.equal(newBase);

    await rewardAsOwner.rewardWorker(worker, TRUST_SCORE_100, 'thank-8');
    expect(await token.balanceOf(worker)).to.equal(newBase);
  });

  it('should reject invalid worker address', async () => {
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const rewardAsOwner = reward.connect(ownerSigner);
    await expect(
      rewardAsOwner.rewardWorker('0x0000000000000000000000000000000000000000', TRUST_SCORE_100, 'thank-9')
    ).to.be.revertedWith('Invalid worker address');
  });

  it('should reject empty thankId', async () => {
    const signers = await hre.ethers.getSigners();
    const ownerSigner = signers.find(s => s.address === owner)!;
    const rewardAsOwner = reward.connect(ownerSigner);
    await expect(
      rewardAsOwner.rewardWorker(worker, TRUST_SCORE_100, '')
    ).to.be.revertedWith('Invalid thankId');
  });
});
