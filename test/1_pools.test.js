const MainnetAddresses = require("./../scripts/mainnet_addresses");
const DAICompoundLeveragePool = artifacts.require("DAICompoundLeveragePool");

contract("DAI Compound Leverage Pool", async (accounts) => {
  it("it should get pool name", async () => {
    const instance = await DAICompoundLeveragePool.deployed();
    const poolName = await instance.getName();
    assert.equal(poolName, "DAI Compound Leverage Pool");
  });
});
