// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Ownable {

    // Token chairman address (owner)
    address internal tokenChairman;

    /**
     * @dev Initialize deployer as owner.
     */
    constructor() {
        tokenChairman = msg.sender;
    }

    /**
     * @dev Verify that sender is contract owner.
     */
    modifier onlyOwner {
        require(msg.sender == tokenChairman, 'You are not a chairman');
        _;
    }

    /**
     * @dev Gets the token chairman.
     * @return the token chairman
     */
    function chairman() external view returns (address) {
        return tokenChairman;
    }

}
