// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./../interfaces/aave/ILendingPoolAddressesProvider.sol";
import "./../interfaces/aave/ILendingPool.sol";
import "./../interfaces/aave/IAToken.sol";
import "./../interfaces/aave/DataTypes.sol";
import "./../interfaces/erc20/Erc20.sol";
import "./IRouter.sol";

contract AAVERouter is IRouter {
    Erc20 private _underlyingAsset;
    ILendingPoolAddressesProvider private _provider;

    /// @dev Logging and debugging event
    // event Log(string, uint256);

    constructor(address _providerAddress, address _underlyingAssetAddress)
        public
    {
        _provider = ILendingPoolAddressesProvider(_providerAddress);
        _underlyingAsset = Erc20(_underlyingAssetAddress);
    }

    function getCurrentAPY() external view override returns (uint256) {
        ILendingPool lendingPool = ILendingPool(_provider.getLendingPool());

        DataTypes.ReserveData memory reserveData =
            lendingPool.getReserveData(address(_underlyingAsset));
        uint256 currentLiquidityRate = reserveData.currentLiquidityRate;

        return currentLiquidityRate;
    }

    function getUnderlyingAsset() external view override returns (address) {
        return address(_underlyingAsset);
    }

    function getUnderlyingDecimals() external view override returns (uint256) {
        return _underlyingAsset.decimals();
    }

    function deposit(uint256 _amount) external override {
        // Caller must approve contract before calling this function
        require(
            _underlyingAsset.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        ILendingPool lendingPool = ILendingPool(_provider.getLendingPool());
        uint16 referralCode = 0;

        _underlyingAsset.approve(_provider.getLendingPool(), _amount);
        lendingPool.deposit(
            address(_underlyingAsset),
            _amount,
            address(this),
            referralCode
        );

        emit Deposit(_amount);
    }

    function withdraw() external override {
        ILendingPool lendingPool = ILendingPool(_provider.getLendingPool());
        uint256 maxUintValue = uint256(-1); // overflow results in max uint256

        lendingPool.withdraw(
            address(_underlyingAsset),
            maxUintValue,
            address(this)
        );

        // this.harvest();

        uint256 balance = _underlyingAsset.balanceOf(address(this));
        require(
            _underlyingAsset.transfer(msg.sender, balance),
            "Transfer failed"
        );

        emit Withdrawal(balance);
    }

    function harvest() external override {
        emit Harvest(0);
    }
}
