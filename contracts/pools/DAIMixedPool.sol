// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./StablecoinMixedPool.sol";

contract DAIMixedPool is StablecoinMixedPool {
    address internal constant _DAI_ADDRESS =
        0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address internal constant _UNISWAP_ROUTER_ADDRESS =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    constructor()
        public
        StablecoinMixedPool(_DAI_ADDRESS, _UNISWAP_ROUTER_ADDRESS)
    {}
}
