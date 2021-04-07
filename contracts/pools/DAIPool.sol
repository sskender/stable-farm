// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./IPool.sol";
import "./../protocols/compound/PriceFeed.sol";
import "./../protocols/compound/Comptroller.sol";
import "./../protocols/compound/CErc20.sol";
import "./../protocols/uniswap/Uniswap.sol";
import "./../ERC20/Erc20.sol";
import "./../math/SafeMath.sol";
import "./../math/SignedSafeMath.sol";

contract DAIPool is IPool, Uniswap {
    uint256 internal constant _MIN_UNDERLYING_VALUE = 25;
    uint256 internal constant _UNDERLYING_DECIMALS = 18;

    address private _uniswapRouterAddress;

    Comptroller private _comptroller;
    CErc20 private _cDai;
    Erc20 private _dai;
    Erc20 private _comp;
    PriceFeed private _priceFeed;

    event Log(string, uint256);

    /// @dev Pool constructor
    constructor(
        address _comptrollerAddress,
        address _cDaiAddress,
        address _daiAddress,
        address _oracleAddress,
        address _uniswapAddress
    ) public {
        _comptroller = Comptroller(_comptrollerAddress);
        _cDai = CErc20(_cDaiAddress);
        _dai = Erc20(_daiAddress);
        _priceFeed = PriceFeed(_oracleAddress);
        _uniswapRouterAddress = _uniswapAddress;

        // Get COMP address
        address _compAddress = _comptroller.getCompAddress();
        _comp = Erc20(_compAddress);

        // Enter cDAI market
        _enterMarkets();
    }

    /// @dev Enter the Compound market to borrow another type of asset
    function _enterMarkets() private {
        address[] memory cTokens = new address[](1);
        cTokens[0] = address(_cDai);
        uint256[] memory errors = _comptroller.enterMarkets(cTokens);

        if (errors[0] != 0) {
            revert("Comptroller.enterMarkets Error");
        }
    }

    /// @dev Get the name of the pool
    function getName() external pure override returns (string memory) {
        return "DAI Pool";
    }

    /// @dev Supply underlying to Compound protocol
    function _supplyCollateral(uint256 _amount) private {
        // Approve transfer
        _dai.approve(address(_cDai), _amount);

        // Mint cToken
        uint256 mintError = _cDai.mint(_amount);
        require(mintError == 0, "CErc20.mint Error");

        emit Log("supply successful", _amount);
    }

    /// @dev Borrow asset from Compound protocol
    function _borrowAsset() private returns (uint256) {
        // Get contract total liquidity
        (uint256 liquidityError, uint256 liquidity, uint256 shortfall) =
            _comptroller.getAccountLiquidity(address(this));

        require(liquidityError == 0, "Comptroller.getAccountLiquidity Error");
        require(shortfall == 0, "account subjected to liquidation");
        require(liquidity > 0, "account has excess collateral");

        // Borrow maximum of underlying asset
        uint256 cDaiPrice = _priceFeed.getUnderlyingPrice(address(_cDai));
        uint256 borrow =
            SafeMath.mul(
                SafeMath.div(liquidity, cDaiPrice),
                10**_UNDERLYING_DECIMALS
            );

        uint256 borrowError = _cDai.borrow(borrow);
        require(borrowError == 0, "CErc20.borrow Error");

        emit Log("borrow successful", borrow);

        return borrow;
    }

    /// @dev Supply the given amount of an asset to the protocol
    function deposit(uint256 _amount) external override {
        // Deposit token on sender's behalf
        // User must approve before calling the function
        _dai.transferFrom(msg.sender, address(this), _amount);

        // Supply and borrow multiple times
        uint256 minimumCollateral =
            SafeMath.mul(_MIN_UNDERLYING_VALUE, 10**_UNDERLYING_DECIMALS);
        uint256 collateral = _amount;
        while (collateral > minimumCollateral) {
            _supplyCollateral(collateral);
            collateral = _borrowAsset();
        }
        _supplyCollateral(collateral);

        emit Deposit(_amount);
    }

    /// @dev Repay the borrow and convert back to underlying
    function _closePosition(uint256 _amount) private {
        // Approve transfer
        _dai.approve(address(_cDai), _amount);

        // Repay borrow
        uint256 repayError = _cDai.repayBorrow(_amount);
        require(repayError == 0, "CErc20.repayBorrow Error");

        // Redeem cDai for Dai
        uint256 balancecDai = _cDai.balanceOf(address(this));
        uint256 redeemError = _cDai.redeem(balancecDai);
        require(redeemError == 0, "CErc20.redeem Error");
    }

    /// @dev Claim COMP token rewards
    function harvest() external override {
        uint256 compBefore = _comp.balanceOf(address(this));

        _comptroller.claimComp(address(this));

        uint256 compAfter = _comp.balanceOf(address(this));
        uint256 harvested = SafeMath.sub(compAfter, compBefore);

        emit Harvest(harvested);
    }

    /// @dev Withdraw the given amount of supplied collateral
    function withdraw(uint256 _amount) external override {}

    /// @dev Withdraw all supplied collateral and rewards
    function withdrawAll() external override {
        // Transfer more DAI to repay borrow if necessary
        // User must approve before calling the function
        uint256 borrow = _cDai.borrowBalanceCurrent(address(this));

        uint256 availableForRepay = _dai.balanceOf(address(this));
        int256 shortage =
            SignedSafeMath.sub(int256(borrow), int256(availableForRepay));
        if (shortage > 0) {
            _dai.transferFrom(msg.sender, address(this), uint256(shortage));
        }

        // Close leverage position
        _closePosition(borrow);

        // Claim COMP token rewards
        this.harvest();
        uint256 amountIn = _comp.balanceOf(address(this));
        this.swapTokensAForTokensB(
            address(_comp),
            address(_dai),
            _uniswapRouterAddress,
            amountIn
        );

        // Transfer reclaimed DAI + rewards back to user
        uint256 balance = _dai.balanceOf(address(this));
        _dai.transfer(msg.sender, balance);

        emit Withdrawal(balance);
    }
}
