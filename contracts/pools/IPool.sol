// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IPool {
    /// @dev Event upon successful deposit
    event Deposit(uint256);

    /// @dev Event upon successful withdrawal
    event Withdrawal(uint256);

    /// @dev Event upon successful rebalance
    event Rebalanced(uint256);

    /// @dev Add new router address to the pool protocol
    function addRouter(address _newRouter) external;

    /// @dev Get all available routers in the pool protocol
    function getRouters() external view returns (address[] memory);

    /// @dev Get the Ethereum address of the underlying asset
    function getAssetAddress() external view returns (address);

    /// @dev Get the name of the underlying asset
    function getAssetName() external view returns (string memory);

    /// @dev Get the symbol of the underlying asset
    function getAssetSymbol() external view returns (string memory);

    /// @dev Get the current APY for farming asset
    function getCurrentAPY() external view returns (uint256);

    /// @dev Get the best available APY
    function getBestAPY() external view returns (uint256);

    /// @dev Deposit underlying asset to the pool protocol
    function deposit(uint256 _amount) external;

    /// @dev Withdraw underlying asset from the pool protocol
    function withdraw(uint256 _amount) external;

    /// @dev Rebalance to the best available APY
    function rebalance() external;
}
