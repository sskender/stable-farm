// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IPool {
    /// @dev Get the name of the pool
    function getName() external pure returns (string memory);

    /// @dev Supply the given amount of an asset to protocol
    function deposit(uint256 _amount) external;
}
