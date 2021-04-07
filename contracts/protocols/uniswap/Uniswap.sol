// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./../../ERC20/Erc20.sol";
import "./IUniswapV2Router02.sol";
import "./../../math/SafeMath.sol";

contract Uniswap {
    Erc20 private _tokenA;
    Erc20 private _tokenB;
    IUniswapV2Router02 private _uniswapRouter;

    event Log(string, uint256);

    constructor(
        address _tokenAAddress,
        address _tokenBAddress,
        address _uniswapRouterAddress
    ) public {
        _tokenA = Erc20(_tokenAAddress);
        _tokenB = Erc20(_tokenBAddress);
        _uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
    }

    /// @dev Swap exact number of tokens A for as many tokens B
    function swapTokensAForTokensB(uint256 amountIn) external {
        _tokenA.approve(address(_uniswapRouter), amountIn);

        address[] memory path = new address[](3);
        path[0] = address(_tokenA);
        path[1] = _uniswapRouter.WETH();
        path[2] = address(_tokenB);

        uint256[] memory amounts = _uniswapRouter.getAmountsOut(amountIn, path);
        uint256 amountOutMin =
            SafeMath.div(SafeMath.mul(amounts[amounts.length - 1], 98), 100);

        uint256 deadline = SafeMath.add(block.timestamp, 15);

        _uniswapRouter.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );
    }
}
