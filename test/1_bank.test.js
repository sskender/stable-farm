const BankAccount = artifacts.require("BankAccount");

contract("Mint dai", async (accounts) => {
  it("it should deposit eth to bank account", async () => {
    const instance = await BankAccount.deployed();
    const sender = accounts[0];
    const amountToDeposit = "5";

    const balanceOfSenderBefore = await web3.eth.getBalance(sender);
    const balanceBefore = await instance.getBalance();

    const valueToDeposit = web3.utils.toWei(amountToDeposit, "ether");
    await instance.depositEth({ from: sender, value: valueToDeposit });

    const balanceOfSenderAfter = await web3.eth.getBalance(sender);
    const balanceAfterInWei = await instance.getBalance();
    const balanceAfter = web3.utils.fromWei(balanceAfterInWei, "ether");

    assert.isBelow(Number(balanceOfSenderAfter), Number(balanceOfSenderBefore));
    assert.equal(balanceBefore, "0");
    assert.equal(balanceAfter, amountToDeposit);
  });
});
