const DaoToken = artifacts.require('DaoToken');

contract('DaoToken test', async (accounts) => {
  it('it should set default token values', async () => {
    const instance = await DaoToken.deployed();
    const name = await instance.name();
    const symbol = await instance.symbol();
    const granularity = await instance.granularity();
    const mintable = await instance.isMintable();
    assert.equal(name, 'EESTEC LC Zagreb');
    assert.equal(symbol, 'EZG');
    assert.equal(granularity.valueOf(), 1);
    assert.equal(mintable, false);
  });

  it('it should mint one token to deployer', async () => {
    const deployerAcc = accounts[0];
    const instance = await DaoToken.deployed();
    const supply = await instance.totalSupply();
    const balance = await instance.balanceOf(deployerAcc);
    const holders = await instance.tokenHolders();
    assert.equal(supply.valueOf(), 1);
    assert.equal(balance.valueOf(), 1);
    assert.equal(holders.length, 1);
    assert.equal(holders[0], deployerAcc);
  });

  it('it should enable and disable minting', async () => {
    const instance = await DaoToken.deployed();
    const mintable1 = await instance.isMintable();
    await instance.enableMinting();
    const mintable2 = await instance.isMintable();
    await instance.disableMinting();
    const mintable3 = await instance.isMintable();
    assert.equal(mintable1, false);
    assert.equal(mintable2, true);
    assert.equal(mintable3, false);
  });
});
