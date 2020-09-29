// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./IERC777Token.sol";

contract ERC777Token is IERC777Token {
    // Token name
    string internal tokenName;

    // Token symbol
    string internal tokenSymbol;

    // Token granularity
    uint256 internal tokenGranularity;

    // Token total supply
    uint256 internal tokenTotalSupply;

    // Balances of each token holder
    mapping(address => uint256) internal holdersBalances;

    /**
     *
     */
    constructor() {}

    /**
     * @dev Gets the token name.
     * @return the token name
     */
    function name() external override view returns (string memory) {
        return tokenName;
    }

    /**
     * @dev Gets the token symbol.
     * @return the token symbol
     */
    function symbol() external override view returns (string memory) {
        return tokenSymbol;
    }

    /**
     * @dev Gets the total number of minted tokens.
     * @return the total supply of tokens
     */
    function totalSupply() external override view returns (uint256) {
        return tokenTotalSupply;
    }

    /**
     * @dev Gets the balance of the account with address holder.
     * @param holder the address of token holder for which the balance is returned
     * @return the balance of token holder
     */
    function balanceOf(address holder)
        external
        override
        view
        returns (uint256)
    {}

    /**
     * @dev Gets the smallest part of the token that is not divisible.
     * @return the token granularity
     */
    function granularity() external override view returns (uint256) {
        return tokenGranularity;
    }

    /**
     * @dev Gets the list of addresses which are allowed to operate with tokens on behalf of some holder.
     * @return the token operators
     */
    function defaultOperators()
        external
        override
        view
        returns (address[] memory)
    {}

    /**
     * @dev Check whether the operator is allowed to manage tokens held by the holder address.
     * @param operator the address of the operator
     * @param holder the address of the token holder
     * @return true if the operator is allowed to manage tokens of holder
     */
    function isOperatorFor(address operator, address holder)
        external
        override
        view
        returns (bool)
    {}

    /**
     * @dev Authorize an operator to manage tokens of the sender (caller's address).
     * @param operator the operator's address that will be authorized
     */
    function authorizeOperator(address operator) external override {}

    /**
     * @dev Revoke an operator's rights to manage tokens of the sender (caller's address).
     * @param operator the operator's address that will be revoked
     */
    function revokeOperator(address operator) external override {}

    /**
     * @dev Move amount of tokens from the sender's (caller's) address to recipient's address.
     * @param to the address of recipient
     * @param amount number of tokens to move
     * @param data data generated by the holder
     */
    function send(
        address to,
        uint256 amount,
        bytes calldata data
    ) external override {}

    /**
     * @dev Move amount of tokens on behalf of the address from to address to.
     * @param from the address holding tokens
     * @param to the address of the recipient
     * @param amount number of tokens to send
     * @param data data generated by the holder
     * @param operatorData data generated by the operator
     */
    function operatorSend(
        address from,
        address to,
        uint256 amount,
        bytes calldata data,
        bytes calldata operatorData
    ) external override {}

    /**
     * @dev Destroys amount of tokens from the sender’s account (caller's address), reducing the total supply.
     * @param amount number of tokens to burn
     * @param data data generated by the holder
     */
    function burn(uint256 amount, bytes calldata data) external override {}

    /**
     * @dev Burn amount of tokens on behalf of the address from.
     * @param from the address holding tokens
     * @param amount number of tokens to burn
     * @param data data generated by the holder
     * @param operatorData data generated by the operator
     */
    function operatorBurn(
        address from,
        uint256 amount,
        bytes calldata data,
        bytes calldata operatorData
    ) external override {}
}
