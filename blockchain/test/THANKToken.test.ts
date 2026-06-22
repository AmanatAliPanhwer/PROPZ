import { expect } from 'chai';
import hre from 'hardhat';
import { type THANKToken } from '../typechain-types';

describe('THANKToken', () => {
  let token: THANKToken;
  let owner: string;
  let rewardDistributor: string;
  let user: string;

  beforeEach(async () => {
    [owner, rewardDistributor, user] = await hre.ethers.getSigners().then(s => s.map(a => a.address));
    const factory = await hre.ethers.getContractFactory('THANKToken');
    token = await factory.deploy(owner, rewardDistributor);
  });

  it('should have correct name, symbol, and decimals', async () => {
    expect(await token.name()).to.equal('THANK');
    expect(await token.symbol()).to.equal('$THANK');
    expect(await token.decimals()).to.equal(18);
  });

  it('should have a cap of 1 billion tokens', async () => {
    const cap = await token.cap();
    expect(cap).to.equal(1_000_000_000n * 10n ** 18n);
  });

  it('should start with zero supply', async () => {
    expect(await token.totalSupply()).to.equal(0n);
  });

  it('should allow MINTER_ROLE to mint tokens', async () => {
    const signers = await hre.ethers.getSigners();
    const distributorSigner = signers.find(s => s.address === rewardDistributor)!;
    const tokenAsDistributor = token.connect(distributorSigner);
    await tokenAsDistributor.mint(user, 100n * 10n ** 18n);
    expect(await token.balanceOf(user)).to.equal(100n * 10n ** 18n);
  });

  it('should not allow non-minter to mint', async () => {
    const signers = await hre.ethers.getSigners();
    const userSigner = signers.find(s => s.address === user)!;
    const tokenAsUser = token.connect(userSigner);
    await expect(tokenAsUser.mint(user, 100n * 10n ** 18n)).to.be.reverted;
  });

  it('should enforce the cap', async () => {
    const signers = await hre.ethers.getSigners();
    const distributorSigner = signers.find(s => s.address === rewardDistributor)!;
    const tokenAsDistributor = token.connect(distributorSigner);
    const cap = await token.cap();
    await tokenAsDistributor.mint(user, cap);
    await expect(tokenAsDistributor.mint(user, 1n)).to.be.reverted;
  });

  it('should allow BURNER_ROLE to burn tokens', async () => {
    const signers = await hre.ethers.getSigners();
    const distributorSigner = signers.find(s => s.address === rewardDistributor)!;
    const tokenAsDistributor = token.connect(distributorSigner);
    await tokenAsDistributor.mint(user, 100n * 10n ** 18n);
    const tokenAsUser = token.connect(signers.find(s => s.address === user)!);
    await tokenAsUser.approve(rewardDistributor, 50n * 10n ** 18n);
    await tokenAsDistributor.burnFrom(user, 50n * 10n ** 18n);
    expect(await token.balanceOf(user)).to.equal(50n * 10n ** 18n);
  });

  it('should have correct roles granted', async () => {
    const MINTER_ROLE = await token.MINTER_ROLE();
    const BURNER_ROLE = await token.BURNER_ROLE();
    const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();

    expect(await token.hasRole(DEFAULT_ADMIN_ROLE, owner)).to.be.true;
    expect(await token.hasRole(MINTER_ROLE, rewardDistributor)).to.be.true;
    expect(await token.hasRole(BURNER_ROLE, rewardDistributor)).to.be.true;
  });
});
