// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface IMintableToken {
    function mint() external;

    function isMintable() external view returns (bool);

    function enableMinting() external;

    function disableMinting() external;
}
