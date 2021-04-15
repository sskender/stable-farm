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

    function getAPY() external view override returns (uint256) {}

    function getBestAPY() external view override returns (address, uint256) {}

    function deposit(uint256 _amount) external override {}

    function withdraw(uint256 _amount) external override {}

    function rebalance() external override {}
}
