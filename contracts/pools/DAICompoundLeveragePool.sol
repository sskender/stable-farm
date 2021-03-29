// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./IPool.sol";
import "./../protocols/compound/Comptroller.sol";
import "./../protocols/compound/CErc20.sol";
import "./../ERC20/Erc20.sol";

contract DAICompoundLeveragePool is IPool {
    Comptroller private _comptroller;
    CErc20 private _cDai;
    Erc20 private _dai;

    event Log(string, uint256);

    constructor(
        address _comptrollerAddress,
        address _cDaiAddress,
        address _daiAddress
    ) public {
        _comptroller = Comptroller(_comptrollerAddress);
        _cDai = CErc20(_cDaiAddress);
        _dai = Erc20(_daiAddress);
    }

    function getName() external pure override returns (string memory) {
        return "DAI Compound Leverage Pool";
    }
}
