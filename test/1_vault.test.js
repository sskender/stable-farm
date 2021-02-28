const Vault = artifacts.require("Vault");

contract("Vault", async (accounts) => {
  it("it should deposit 5 eth to vault", async () => {
    const instance = await Vault.deployed();
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

  it("it should withdraw 1 eth from vault to sender", async () => {
    const instance = await Vault.deployed();
    const withdrawer = accounts[0];
    const amountToWithdraw = "1";

    const balanceOfWithdrawerBefore = await web3.eth.getBalance(withdrawer);

    const valueToWithdraw = web3.utils.toWei(amountToWithdraw, "ether");
    await instance.withdrawEth(valueToWithdraw, { from: withdrawer });

    const balanceOfWithdrawerAfter = await web3.eth.getBalance(withdrawer);
    const balanceOfContractAfter = await instance.getBalance();
    const amountLeftOnContract = web3.utils.fromWei(
      balanceOfContractAfter,
      "ether"
    );

    assert.equal(amountLeftOnContract, "4");
    assert.isAbove(
      Number(balanceOfWithdrawerAfter),
      Number(balanceOfWithdrawerBefore)
    );
  });

  it("it should withdraw 2 eth from vault to acc 2", async () => {
    const instance = await Vault.deployed();
    const withdrawer = accounts[0];
    const withdrawTo = accounts[1];
    const amountToWithdraw = "2";

    const balanceOfWithdrawerBefore = await web3.eth.getBalance(withdrawer);
    const balanceOfWithdrawToBefore = await web3.eth.getBalance(withdrawTo);

    const valueToWithdraw = web3.utils.toWei(amountToWithdraw, "ether");
    await instance.withdrawEthTo(withdrawTo, valueToWithdraw, {
      from: withdrawer,
    });

    const balanceOfWithdrawerAfter = await web3.eth.getBalance(withdrawer);
    const balanceOfWithdrawToAfter = await web3.eth.getBalance(withdrawTo);
    const balanceOfContractAfter = await instance.getBalance();
    const amountLeftOnContract = web3.utils.fromWei(
      balanceOfContractAfter,
      "ether"
    );

    assert.equal(amountLeftOnContract, "2");
    assert.isBelow(
      Number(balanceOfWithdrawerAfter),
      Number(balanceOfWithdrawerBefore)
    );
    assert.isAbove(
      Number(balanceOfWithdrawToAfter),
      Number(balanceOfWithdrawToBefore)
    );
  });

  it("it should withdraw all eth from vault (with overflow)", async () => {
    const instance = await Vault.deployed();
    const withdrawer = accounts[0];

    const balanceOfWithdrawerBefore = await web3.eth.getBalance(withdrawer);

    const valueToWithdraw = (await instance.getBalance()) + 10;
    await instance.withdrawEth(valueToWithdraw, { from: withdrawer });

    const balanceOfWithdrawerAfter = await web3.eth.getBalance(withdrawer);
    const balanceOfContractAfter = await instance.getBalance();

    assert.equal(balanceOfContractAfter, 0);
    assert.isAbove(
      Number(balanceOfWithdrawerAfter),
      Number(balanceOfWithdrawerBefore)
    );
  });
});
