// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./StablecoinPool.sol";

contract USDTPool is StablecoinPool {
    address internal constant _USDT_ADDRESS =
        0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address internal constant _UNISWAP_ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    constructor()
        public
        StablecoinPool(_USDT_ADDRESS, _UNISWAP_ROUTER_ADDRESS)
    {}
}
