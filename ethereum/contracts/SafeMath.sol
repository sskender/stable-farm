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

    /**
     * @dev Divide two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * @param a first integer
     * @param b second integer
     * @return the division
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, 'division by zero');
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * @param a first integer
     * @param b second integer
     * @param errorMessage safemath error message
     * @return the division
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;

        return c;
    }
}
