// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IPool {
    /// @dev Event upon successful collateral deposit
    event Deposit(uint256);

    /// @dev Event upon successful withdrawal
    event Withdrawal(uint256);

    /// @dev Event upon successful harvest
    event Harvest(uint256);

    /// @dev Get the name of the pool
    function getName() external pure returns (string memory);

    /// @dev Supply the given amount of an asset to the protocol
    function deposit(uint256 _amount) external;

    /// @dev Withdraw the given amount of supplied collateral
    function withdraw(uint256 _amount) external;

    /// @dev Withdraw all supplied collateral and rewards
    function withdrawAll() external;

    /// @dev Claim COMP token rewards
    function harvest() external;
}
