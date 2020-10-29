const DaoToken = artifacts.require('DaoToken');

contract('DaoToken test', async (accounts) => {
  it('it should mint one token to deployer', async () => {
    const instance = await DaoToken.deployed();
    const symbol = await instance.symbol();
    const supply = await instance.totalSupply();
    const balance = await instance.balanceOf(accounts[0]);
    const holders = await instance.tokenHolders();
    assert.equal(symbol, 'EZG');
    assert.equal(supply.valueOf(), 1);
    assert.equal(balance.valueOf(), 1);
    assert.equal(holders.length, 1);
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
