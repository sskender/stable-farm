const Borrow = artifacts.require("Borrow");
const MainnetAddress = require("./mainnet_addresses");

contract("Borrow", async (accounts) => {
  it("it should borrow DAI from ETH", async () => {
    // prepare
    const instance = await Borrow.deployed();
    const sender = accounts[0];
    const ethToSupplyAsCollateral = 10;

    // send eth for dai
    await instance.borrowDai({
      from: sender,
      value: (ethToSupplyAsCollateral * 1e18).toString(),
    });

    // balances
    const balanceEthSender = await web3.eth.getBalance(sender);
    const balanceEthContract = await web3.eth.getBalance(instance.address);

    const balanceCEthSender = await instance.balanceOf(
      MainnetAddress.CETH_ADDRESS,
      sender
    );
    const balanceCEthContract = await instance.balanceOf(
      MainnetAddress.CETH_ADDRESS,
      instance.address
    );
    const balanceCDaiSender = await instance.balanceOf(
      MainnetAddress.CDAI_ADDRESS,
      sender
    );
    const balanceCDaiContract = await instance.balanceOf(
      MainnetAddress.CDAI_ADDRESS,
      instance.address
    );
    const balanceDaiSender = await instance.balanceOf(
      MainnetAddress.DAI_ADDRESS,
      sender
    );
    const balanceDaiContract = await instance.balanceOf(
      MainnetAddress.DAI_ADDRESS,
      instance.address
    );

    assert.isBelow(Number(balanceEthSender), 90 * 1e18);
    assert.equal(Number(balanceEthContract), 0);
    assert.equal(Number(balanceCEthSender), 0);
    assert.isAbove(Number(balanceCEthContract), 0);
    assert.equal(Number(balanceCDaiSender), 0);
    assert.equal(Number(balanceCDaiContract), 0);
    assert.isAbove(Number(balanceDaiSender), 1000 * 1e18);
    assert.equal(Number(balanceDaiContract), 0);
  });
});
