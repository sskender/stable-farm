// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./../protocols/compound/Comptroller.sol";
import "./../protocols/compound/CErc20.sol";
import "./../ERC20/Erc20.sol";
import "./IController.sol";
import "./Uniswap.sol";
import "./../math/SafeMath.sol";
import "./../math/SignedSafeMath.sol";

contract CompoundController is IController, Uniswap {
    Comptroller private _comptroller;
    Erc20 private _underlyingAsset;
    CErc20 private _cToken;
    Erc20 private _compToken;

    /// @dev Logging and debugging event
    event Log(string, uint256);

    constructor(
        address _comptrollerAddress,
        address _underlyingAssetAddress,
        address _cTokenAddress,
        address _uniswapRouterAddress
    ) public Uniswap(_uniswapRouterAddress) {
        _comptroller = Comptroller(_comptrollerAddress);
        _underlyingAsset = Erc20(_underlyingAssetAddress);
        _cToken = CErc20(_cTokenAddress);

        address compTokenAddress = _comptroller.getCompAddress();
        _compToken = Erc20(compTokenAddress);

        _enterMarkets();
    }

    /// @dev Enter the Compound market to provide liquidity
    function _enterMarkets() internal {
        address[] memory cTokens = new address[](1);
        cTokens[0] = address(_cToken);
        uint256[] memory errors = _comptroller.enterMarkets(cTokens);

        if (errors[0] != 0) {
            revert("Comptroller.enterMarkets Error");
        }
    }

    /// @dev Supply underlying asset to protocol
    function _supplyUnderlying(uint256 _amount) internal {
        _underlyingAsset.approve(address(_cToken), _amount);

        uint256 mintError = _cToken.mint(_amount);
        require(mintError == 0, "CErc20.mint Error");

        emit Log("Supplied", _amount);
    }

    /// @dev Redeem cTokens for underlying asset
    function _redeemUnderlying(uint256 _amount) internal {
        uint256 redeemError = _cToken.redeem(_amount);
        require(redeemError == 0, "CErc20.redeem Error");

        emit Log("Redeemed", _amount);
    }

    function getCurrentAPY() external override returns (uint256) {}

    function getUnderlyingAsset() external view override returns (address) {
        return address(_underlyingAsset);
    }

    function getUnderlyingDecimals() external view override returns (uint256) {
        return _underlyingAsset.decimals();
    }

    function deposit(uint256 _amount) external override {
        // Caller must approve contract before calling this function
        _underlyingAsset.transferFrom(msg.sender, address(this), _amount);
        _supplyUnderlying(_amount);

        emit Deposit(_amount);
    }

    function withdraw() external override {
        uint256 balancecToken = _cToken.balanceOf(address(this));
        _redeemUnderlying(balancecToken);

        this.harvest();

        uint256 balance = _underlyingAsset.balanceOf(address(this));
        _underlyingAsset.transfer(msg.sender, balance);

        emit Withdrawal(balance);
    }

    function harvest() external override {
        _comptroller.claimComp(address(this));

        uint256 amountIn = _compToken.balanceOf(address(this));
        require(amountIn > 0, "No COMP tokens to swap");

        Uniswap._swapTokensAForTokensB(
            address(_compToken),
            address(_underlyingAsset),
            amountIn
        );

        uint256 swapped = _underlyingAsset.balanceOf(address(this));
        emit Harvest(swapped);
    }
}
