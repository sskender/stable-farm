// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @dev Math library with overflow checks.
 */
library SafeMath {
    /**
     * @dev Add two unsigned integers without overflow.
     * @param a first integer
     * @param b second integer
     * @return the sum
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, 'overflow');

        return c;
    }
}
