// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./ERC20/Erc20.sol";
import "./oracle/PriceFeed.sol";
import "./protocols/compound/CErc20.sol";
import "./protocols/compound/CEth.sol";
import "./protocols/compound/Comptroller.sol";

contract Borrow {
    address internal constant _COMPTROLLER_ADDRESS =
        0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B;
    address internal constant _PRICE_FEED_ADDRESS =
        0x922018674c12a7F0D394ebEEf9B58F186CdE13c1;
    address internal constant _CETH_ADDRESS =
        0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5;
    address internal constant _CDAI_ADDRESS =
        0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643;
    address internal constant _DAI_ADDRESS =
        0x6B175474E89094C44Da98b954EedeAC495271d0F;

    event MyLog(string, uint256);

    function borrowDai() public payable {
        _borrowErc20FromEth(_CDAI_ADDRESS, _DAI_ADDRESS, 18);
    }

    function _borrowErc20FromEth(
        address _cErc20Address,
        address _erc20Address,
        uint256 _underlyingDecimals
    ) private {
        Comptroller comptroller = Comptroller(_COMPTROLLER_ADDRESS);
        PriceFeed priceFeed = PriceFeed(_PRICE_FEED_ADDRESS);
        CEth cEth = CEth(_CETH_ADDRESS);
        CErc20 cErc20 = CErc20(_cErc20Address);
        Erc20 erc20 = Erc20(_erc20Address);

        // Supply ETH as a collateral, get cETH in return
        cEth.mint.value(msg.value)();

        // Enter the cToken market
        address[] memory cTokens = new address[](1);
        cTokens[0] = _CETH_ADDRESS;
        uint256[] memory errors = comptroller.enterMarkets(cTokens);
        if (errors[0] != 0) {
            revert("Comptroller: enterMarkets failed");
        }

        // Get account liquidity value in Compound protocol
        (uint256 error, uint256 liquidity, uint256 shortfall) =
            comptroller.getAccountLiquidity(address(this));
        if (error != 0) {
            revert("Comptroller: getAccountLiquidity failed");
        }
        require(shortfall == 0, "Comptroller: account underwater");
        require(liquidity > 0, "Comptroller: account has excess collateral");

        // Get the underlying price in USD from the oracle
        uint256 underlyingPrice = priceFeed.getUnderlyingPrice(_cErc20Address);

        // Borrow maximum amount
        uint256 maxBorrowUnderlying = liquidity / underlyingPrice;
        cErc20.borrow(maxBorrowUnderlying * 10**_underlyingDecimals);

        // Transfer borrowed to user
        uint256 borrowed = cErc20.borrowBalanceCurrent(address(this));
        erc20.transfer(msg.sender, borrowed);
    }

    function balanceOf(address _erc20Address, address _holder)
        external
        view
        returns (uint256)
    {
        Erc20 erc20 = Erc20(_erc20Address);
        return erc20.balanceOf(_holder);
    }
}
