// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./../interfaces/erc20/Erc20.sol";
import "./../interfaces/uniswap/IUniswapV2Router02.sol";
import "./../math/SafeMath.sol";

contract Uniswap {
    uint256 internal constant _MAX_SLIPPAGE_PERCENT = 2;
    uint256 internal constant _DEADLINE_IN_SECONDS = 15;

    IUniswapV2Router02 private _uniswapRouter;

    constructor(address _uniswapRouterAddress) public {
        _uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
    }

    /// @dev Swap exact number of tokens A for as many tokens B
    function swapTokensAForTokensB(
        address _tokenA,
        address _tokenB,
        uint256 _amountIn
    ) external {
        Erc20 tokenA = Erc20(_tokenA);
        Erc20 tokenB = Erc20(_tokenB);

        tokenA.approve(address(_uniswapRouter), _amountIn);

        address[] memory path = new address[](3);
        path[0] = address(tokenA);
        path[1] = _uniswapRouter.WETH();
        path[2] = address(tokenB);

        uint256[] memory amounts =
            _uniswapRouter.getAmountsOut(_amountIn, path);

        // amountOutMin = amountOutMin * 0.98
        //              = amountOutMin * 98 / 100
        //              = amountOutMin * (100 - allowed slippage) / 100
        uint256 lastPairAmount = amounts[amounts.length - 1];
        uint256 product =
            SafeMath.mul(lastPairAmount, (100 - _MAX_SLIPPAGE_PERCENT));
        uint256 amountOutMin = SafeMath.div(product, 100);

        // time.now() + 15 sec
        uint256 deadline = SafeMath.add(block.timestamp, _DEADLINE_IN_SECONDS);

        _uniswapRouter.swapExactTokensForTokens(
            _amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );
    }
}
