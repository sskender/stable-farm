// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IPool {
    /// @dev Get the name of the pool
    function getName() external pure returns (string memory);
}
