// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./IPool.sol";
import "./../interfaces/erc20/Erc20.sol";
import "./../routers/IRouter.sol";
import "./../routers/Uniswap.sol";

contract StablePool is IPool, Uniswap {
    Erc20 private _poolAsset;
    uint256 private _numberOfRouters;
    address[] private _routersList;
    IRouter private _activeRouter;

    /// @dev Logging and debugging event
    event Log(string, uint256);

    constructor(address _assetAddress, address _uniswapRouterAddress)
        public
        Uniswap(_uniswapRouterAddress)
    {
        _numberOfRouters = 0;
        _poolAsset = Erc20(_assetAddress);
    }

    function addRouter(address _newRouter) external override {
        for (uint256 i = 0; i < _numberOfRouters; i++) {
            if (_routersList[i] == _newRouter) {
                revert("This router already exists");
            }
        }
        _routersList.push(_newRouter);
        _numberOfRouters++;
    }

    function getRouters() external view override returns (address[] memory) {
        return _routersList;
    }

    function getAssetAddress() external view override returns (address) {
        return address(_poolAsset);
    }

    function getAssetName() external view override returns (string memory) {
        return _poolAsset.name();
    }

    function getAssetSymbol() external view override returns (string memory) {
        return _poolAsset.symbol();
    }

    function getAPY() external view override returns (uint256) {
        if (address(_activeRouter) != address(0)) {
            return _activeRouter.getCurrentAPY();
        } else {
            return 0;
        }
    }

    function getBestAPY() external view override returns (address, uint256) {
        // (APY percentage) * 10 ^ 27
        uint256 bestAPY = 0;
        address bestRouter;
        for (uint256 i = 0; i < _numberOfRouters; i++) {
            uint256 routerAPY = IRouter(_routersList[i]).getCurrentAPY();
            // TODO safemath
            uint256 scaledAPY = routerAPY / (10**25);
            if (scaledAPY > bestAPY) {
                bestAPY = scaledAPY;
                bestRouter = _routersList[i];
            }
        }
        return (bestRouter, bestAPY);
    }

    function deposit(uint256 _amount) external override {}

    function withdraw(uint256 _amount) external override {}

    function rebalance() external override {}
}
