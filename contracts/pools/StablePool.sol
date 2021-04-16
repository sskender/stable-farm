// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./IPool.sol";
import "./../interfaces/erc20/Erc20.sol";
import "./../routers/IRouter.sol";
import "./../dex/Uniswap.sol";
import "./../math/SafeMath.sol";

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
        // RAY = (APY percentage) * 10 ^ 27
        // scaled APY to Integer = RAY / (10^25)
        uint256 bestAPY = 0;
        address bestRouter;
        for (uint256 i = 0; i < _numberOfRouters; i++) {
            uint256 routerAPY = IRouter(_routersList[i]).getCurrentAPY();
            uint256 scaledAPY = SafeMath.div(routerAPY, 10**25);
            if (scaledAPY > bestAPY) {
                bestAPY = scaledAPY;
                bestRouter = _routersList[i];
            }
        }
        return (bestRouter, bestAPY);
    }

    /// @dev Swap asset to router's underlying asset
    function _swapAssetToRouterAsset(address _asset, address _router) internal {
        IRouter router = IRouter(_router);
        address routerAsset = router.getUnderlyingAsset();

        // Swap asset to router asset
        if (_asset != routerAsset) {
            uint256 balance = Erc20(_asset).balanceOf(address(this));
            this.swapTokensAForTokensB(_asset, routerAsset, balance);
        }
    }

    /// @dev Make the deposit to the router
    function _makeDeposit(address _router) internal {
        IRouter router = IRouter(_router);
        address routerAsset = router.getUnderlyingAsset();

        // Deposit
        uint256 balance = Erc20(routerAsset).balanceOf(address(this));
        Erc20(routerAsset).approve(address(router), balance);
        router.deposit(balance);

        // Update active router
        _activeRouter = router;

        emit Deposit(balance);
    }

    function deposit(uint256 _amount) external override {
        // Caller must approve contract before calling this function
        _poolAsset.transferFrom(msg.sender, address(this), _amount);

        (address routerAddress, uint256 APY) = this.getBestAPY();

        // Withdraw from the old router
        if (
            address(_activeRouter) != address(0) &&
            address(_activeRouter) != routerAddress
        ) {
            _activeRouter.withdraw();

            address asset = _activeRouter.getUnderlyingAsset();
            _swapAssetToRouterAsset(asset, routerAddress);
        }

        // Deposit to the new router
        _swapAssetToRouterAsset(address(_poolAsset), routerAddress);
        _makeDeposit(routerAddress);
    }

    function withdraw(uint256 _amount) external override {}

    function withdrawAll() external override routerIsActive {
        // Withdraw asset from the old router
        _activeRouter.withdraw();

        // Swap back to underlying asset if needed
        address routerAsset = _activeRouter.getUnderlyingAsset();
        address poolAsset = address(_poolAsset);
        if (routerAsset != poolAsset) {
            uint256 amountIn = Erc20(routerAsset).balanceOf(address(this));
            this.swapTokensAForTokensB(routerAsset, poolAsset, amountIn);
        }

        // Destroy router
        _activeRouter = IRouter(address(0));

        // Transfer to sender
        uint256 poolBalance = _poolAsset.balanceOf(address(this));
        _poolAsset.transfer(msg.sender, poolBalance);

        emit Withdrawal(poolBalance);
    }

    function rebalance() external override {}

    modifier routerIsActive {
        require(address(_activeRouter) != address(0), "No active router");
        _;
    }
}
