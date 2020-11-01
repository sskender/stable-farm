/* eslint-disable no-undef */
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

  it('it should prevent from minting when disabled', async () => {
    const instance = await DaoToken.deployed();
    let exception = null;
    try {
      await instance.mint();
    } catch (e) {
      exception = e.reason;
    }
    assert.equal(exception, 'Token is not mintable at the moment');
  });

  it('it should mint token to new members', async () => {
    const deployerAcc = accounts[0];
    const acc2 = accounts[1];
    const instance = await DaoToken.deployed();
    await instance.enableMinting();
    await instance.mint({from: acc2});
    await instance.disableMinting();
    const balance1 = await instance.balanceOf(deployerAcc);
    const balance2 = await instance.balanceOf(acc2);
    const totalSupplyAfter = await instance.totalSupply();
    const holders = await instance.tokenHolders();
    assert.equal(balance1.valueOf(), 1);
    assert.equal(balance2.valueOf(), 1);
    assert.equal(totalSupplyAfter.valueOf(), 2);
    assert.equal(holders.length, 2);
    assert.equal(holders[0], deployerAcc);
    assert.equal(holders[1], acc2);
  });

  it('it should prevent from minting again', async () => {
    const deployerAcc = accounts[0];
    const acc2 = accounts[1];
    let exception1 = null;
    let exception2 = null;
    const instance = await DaoToken.deployed();
    await instance.enableMinting();
    try {
      await instance.mint({from: deployerAcc});
    } catch (e) {
      exception1 = e.reason;
    }
    try {
      await instance.mint({from: acc2});
    } catch (e) {
      exception2 = e.reason;
    }
    assert.equal(exception1, 'You already have a token');
    assert.equal(exception2, 'You already have a token');
  });
});
