// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./../../ERC20/Erc20.sol";
import "./IUniswapV2Router02.sol";
import "./../../math/SafeMath.sol";

contract Uniswap {
    uint256 internal constant _MIN_LEFT_AFTER_SLIPPAGE = 98;
    uint256 internal constant _DEADLINE_IN_SECONDS = 15;

    /// @dev Swap exact number of tokens A for as many tokens B
    function swapTokensAForTokensB(
        address _tokenA,
        address _tokenB,
        address _uniswapRouter,
        uint256 _amountIn
    ) external {
        Erc20 tokenA = Erc20(_tokenA);
        Erc20 tokenB = Erc20(_tokenB);
        IUniswapV2Router02 uniswapRouter = IUniswapV2Router02(_uniswapRouter);

        tokenA.approve(address(uniswapRouter), _amountIn);

        address[] memory path = new address[](3);
        path[0] = address(tokenA);
        path[1] = uniswapRouter.WETH();
        path[2] = address(tokenB);

        uint256[] memory amounts = uniswapRouter.getAmountsOut(_amountIn, path);
        // amountOutMin = amountOutMin * 0.98
        uint256 amountOutMin =
            SafeMath.div(SafeMath.mul(amounts[amounts.length - 1], _MIN_LEFT_AFTER_SLIPPAGE), 100);

        // time.now() + 15 sec
        uint256 deadline = SafeMath.add(block.timestamp, _DEADLINE_IN_SECONDS);

        uniswapRouter.swapExactTokensForTokens(
            _amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );
    }
}
