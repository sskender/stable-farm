// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

interface IProtocol {
    /// @dev Get current unstable APY for the specific asset
    function getAssetAPY(address _asset) returns (uint256);

    /// @dev Get total supplied amount of the underlying asset
    function getSuppliedAmount(address _asset) returns (uint256);

    /// @dev Supply the given amount of asset to a protocol
    function supply(address _asset, uint256 _amount);

    /// @dev Redeem the given amount of asset
    function redeem(address _asset, uint256 _amount);
}
