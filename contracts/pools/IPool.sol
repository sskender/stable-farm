// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IPool {
    /// @dev Event upon successful deposit
    event Deposit(uint256);

    /// @dev Event upon successful withdrawal
    event Withdrawal(uint256);

    /// @dev Event upon successful rebalance
    event Rebalanced(uint256);

    /// @dev
    function addRouter(address _newRouter) external;

    /// @dev
    function getRouters() external view returns (address[] memory);

    /// @dev
    function getAssetAddress() external view returns (address);

    /// @dev
    function getAssetName() external view returns (string memory);

    /// @dev
    function getAssetSymbol() external view returns (string memory);

    /// @dev
    function getCurrentAPY() external view returns (uint256);

    /// @dev
    function getBestAPY() external view returns (uint256);

    /// @dev
    function deposit(uint256 _amount) external;

    /// @dev
    function withdraw(uint256 _amount) external;

    /// @dev
    function rebalance() external;
}
