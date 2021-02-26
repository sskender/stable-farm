pragma solidity ^0.6.0;

contract BankAccount {
    // TODO add owner
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function depositEth() external payable {
        // log
    }

    function withdrawEth(uint256 value) external {
        // log
        // check value matches
        msg.sender.transfer(value);
    }
}
