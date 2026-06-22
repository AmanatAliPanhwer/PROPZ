// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./THANKToken.sol";

contract ThankReward is AccessControl, Pausable {
    bytes32 public constant REWARDER_ROLE = keccak256("REWARDER_ROLE");
    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    THANKToken public thankToken;

    uint256 public baseReward = 10 * 10 ** 18; // 10 THANK (18 decimals)
    uint256 public maxTrustScore = 200;
    uint256 public minTrustScore = 0;

    event WorkerRewarded(
        address indexed worker,
        uint256 amount,
        uint256 trustScore,
        string thankId
    );

    event BaseRewardUpdated(uint256 oldBase, uint256 newBase);
    event TreasuryWithdrawn(address indexed to, uint256 amount);

    constructor(address tokenAddress, address defaultAdmin) {
        thankToken = THANKToken(tokenAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(REWARDER_ROLE, defaultAdmin);
        _grantRole(TREASURY_ROLE, defaultAdmin);
    }

    function rewardWorker(
        address worker,
        uint256 trustScore,
        string calldata thankId
    ) external onlyRole(REWARDER_ROLE) whenNotPaused returns (uint256) {
        require(worker != address(0), "Invalid worker address");
        require(trustScore >= minTrustScore, "Trust score too low");
        require(bytes(thankId).length > 0, "Invalid thankId");

        uint256 cappedScore = trustScore > maxTrustScore ? maxTrustScore : trustScore;
        uint256 amount = (baseReward * cappedScore) / 100;

        require(amount > 0, "Reward amount is zero");

        thankToken.mint(worker, amount);

        emit WorkerRewarded(worker, amount, trustScore, thankId);

        return amount;
    }

    function setBaseReward(uint256 newBase) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newBase > 0, "Base reward must be > 0");
        emit BaseRewardUpdated(baseReward, newBase);
        baseReward = newBase;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function withdrawTreasury(
        address to,
        uint256 amount
    ) external onlyRole(TREASURY_ROLE) {
        require(to != address(0), "Invalid address");
        thankToken.transfer(to, amount);
        emit TreasuryWithdrawn(to, amount);
    }
}
