// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./../../ERC20/Erc20.sol";
import "./IUniswapV2Router02.sol";
import "./../../math/SafeMath.sol";

contract Uniswap {

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
        uint256 amountOutMin =
            SafeMath.div(SafeMath.mul(amounts[amounts.length - 1], 98), 100);

        uint256 deadline = SafeMath.add(block.timestamp, 15);

        uniswapRouter.swapExactTokensForTokens(
            _amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );
    }
}
