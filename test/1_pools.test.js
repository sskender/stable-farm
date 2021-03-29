const MainnetAddresses = require("./../scripts/mainnet_addresses");
const DAICompoundLeveragePool = artifacts.require("DAICompoundLeveragePool");
const Erc20 = artifacts.require("Erc20");

contract("DAI Compound Leverage Pool", async (accounts) => {
  it("it should get pool name", async () => {
    const instance = await DAICompoundLeveragePool.deployed();
    const poolName = await instance.getName();
    assert.equal(poolName, "DAI Compound Leverage Pool");
  });

  it("it should transfer DAI to contract", async () => {
    const instance = await DAICompoundLeveragePool.deployed();
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];
    const amountOfDaiToSupply = 5000;

    // TODO transfer but keep track of who deposited

    // test initial balance
    const balanceSender = await Dai.balanceOf(sender);
    const balanceContract = await Dai.balanceOf(instance.address);
    assert.isAbove(Number(balanceSender), amountOfDaiToSupply * 1e18);
    assert.equal(Number(balanceContract), 0);

    // transfer
    const mantissa = web3.utils.toWei(amountOfDaiToSupply.toString(), "ether");
    await Dai.transfer(instance.address, mantissa);

    // test balance afterwards
    const balanceSenderAfter = await Dai.balanceOf(sender);
    const balanceContractAfter = await Dai.balanceOf(instance.address);
    assert.equal(Number(balanceSenderAfter), Number(balanceSender) - mantissa);
    assert.equal(Number(balanceContractAfter), mantissa);
  });
});
