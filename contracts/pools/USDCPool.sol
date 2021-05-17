// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./StablecoinPool.sol";

contract USDCPool is StablecoinPool {
    address internal constant _USDC_ADDRESS =
        0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address internal constant _UNISWAP_ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    constructor()
        public
        StablecoinPool(_USDC_ADDRESS, _UNISWAP_ROUTER_ADDRESS)
    {}
}
