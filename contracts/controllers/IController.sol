// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IController {
    /// @dev Event upon successful deposit
    event Deposit(uint256);

    /// @dev Event upon successful withdrawal
    event Withdrawal(uint256);

    /// @dev Event upon successful harvest
    event Harvest(uint256);

    /// @dev Get the current APY
    function getCurrentAPY() external returns (uint256);

    /// @dev Get the address of the underlying asset
    function getUnderlyingAsset() external view returns (address);

    /// @dev Supply the given amount of an asset to the protocol
    function deposit(uint256 _amount) external;

    /// @dev Withdraw supplied asset + yield + rewards
    function withdraw() external;

    /// @dev Claim additional protocol rewards
    function harvest() external;
}
