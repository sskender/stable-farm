pragma solidity ^0.6.0;

contract Vault {
    // TODO add owner
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function depositEth() external payable {
        // log
    }

    function withdrawEth(uint256 value) external {
        this.withdrawEthTo(msg.sender, value);
    }

    function withdrawEthTo(address payable to, uint256 value) external {
        // log
        if (value > address(this).balance) {
            to.transfer(address(this).balance);
        } else {
            to.transfer(value);
        }
    }
}
