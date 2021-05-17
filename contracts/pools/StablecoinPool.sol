// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./IPool.sol";
import "./../interfaces/erc20/Erc20.sol";
import "./../routers/IRouter.sol";
import "./../dex/Uniswap.sol";
import "./../math/SafeMath.sol";

contract StablecoinPool is IPool, Uniswap {
    Erc20 private _poolAsset;
    uint256 private _numberOfRouters;
    address[] private _routersList;
    IRouter private _activeRouter;

    /// @dev Logging and debugging event
    // event Log(string, uint256);

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
        // router's APY in RAY = (APY percentage) * 10 ^ 27
        // scaled APY to Integer = (router's APY in RAY) / (10^25) ==> rounding to two decimals
        uint256 bestAPY = 0;
        address bestRouter = address(0);

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

    /// @dev Make the deposit of pool asset to the router (swap asset if required)
    function _makeDeposit() internal {
        // Find the best available router
        (address routerAddress, ) = this.getBestAPY();
        IRouter router = IRouter(routerAddress);
        address routerAssetAddress = router.getUnderlyingAsset();

        // Swap pool asset to router asset (via dex)
        if (routerAssetAddress != address(_poolAsset)) {
            uint256 poolBalance = _poolAsset.balanceOf(address(this));
            this.swapTokensAForTokensB(
                address(_poolAsset),
                routerAssetAddress,
                poolBalance
            );
        }

        // Deposit router's asset
        Erc20 routerAsset = Erc20(routerAssetAddress);
        uint256 balance = routerAsset.balanceOf(address(this));
        routerAsset.approve(routerAddress, balance);
        router.deposit(balance);

        // Set active router
        _activeRouter = router;
    }

    function deposit(uint256 _amount) external override {
        // Caller must approve contract before calling this function
        require(
            _poolAsset.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // Withdraw if any router is currently active
        if (address(_activeRouter) != address(0)) {
            _makeWithdrawal();
        }

        // Deposit all available funds (rebalance)
        _makeDeposit();

        emit Deposit(_amount);
    }

    /// @dev Withdraw from the active router (swap asset if required)
    function _makeWithdrawal() internal routerIsActive returns (uint256) {
        // Withdraw asset from the router
        _activeRouter.withdraw();

        // Swap router asset to pool asset (via dex)
        address routerAssetAddress = _activeRouter.getUnderlyingAsset();
        if (routerAssetAddress != address(_poolAsset)) {
            uint256 routerBalance =
                Erc20(routerAssetAddress).balanceOf(address(this));
            this.swapTokensAForTokensB(
                routerAssetAddress,
                address(_poolAsset),
                routerBalance
            );
        }

        // Destroy router
        _activeRouter = IRouter(address(0));

        // Return available pool balance
        return _poolAsset.balanceOf(address(this));
    }

    function withdraw(uint256 _amount) external override routerIsActive {
        uint256 poolBalance = _makeWithdrawal();

        if (_amount <= poolBalance) {
            // Transfer desired amount to caller
            require(
                _poolAsset.transfer(msg.sender, _amount),
                "Transfer failed"
            );
            emit Withdrawal(_amount);

            // Deposit back the rest
            _makeDeposit();
        } else {
            // Transfer maximum available amount to caller
            require(
                _poolAsset.transfer(msg.sender, poolBalance),
                "Transfer failed"
            );
            emit Withdrawal(poolBalance);
        }
    }

    function withdrawAll() external override routerIsActive {
        uint256 poolBalance = _makeWithdrawal();
        require(
            _poolAsset.transfer(msg.sender, poolBalance),
            "Transfer failed"
        );

        emit Withdrawal(poolBalance);
    }

    function rebalance() external override routerIsActive betterRouterExists {
        uint256 poolBalance = _makeWithdrawal();
        _makeDeposit();

        emit Rebalanced(poolBalance);
    }

    modifier routerIsActive {
        require(address(_activeRouter) != address(0), "No active router");
        _;
    }

    modifier betterRouterExists {
        (address routerAddress, ) = this.getBestAPY();
        require(routerAddress != address(_activeRouter), "Already rebalanced");
        _;
    }
}
