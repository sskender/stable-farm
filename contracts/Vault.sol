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
        // log
        if (value > address(this).balance) {
            msg.sender.transfer(address(this).balance);
        } else {
            msg.sender.transfer(value);
        }
    }
}
