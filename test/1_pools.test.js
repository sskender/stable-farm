/* eslint-disable no-undef */
const MainnetAddresses = require("./mainnet.addresses");
const daiAbi = require("./abi/dai-abi.json");
// const utils = require("./utils");

const DAIPool = artifacts.require("DAIPool");
const Erc20 = artifacts.require("Erc20");

contract("DAI Pool", async (accounts) => {
  it("it should mint test DAI tokens to account", async () => {
    const daiMcdJoin = MainnetAddresses.DAI_MCD_JOIN;
    const daiAddress = MainnetAddresses.DAI_ADDRESS;

    const receiver = accounts[0];
    const numbDaiToMint = 10000;

    const daiContract = new web3.eth.Contract(daiAbi, daiAddress);
    const mantissa = web3.utils.toWei(numbDaiToMint.toString(), "ether");

    await daiContract.methods.mint(receiver, mantissa).send({
      from: daiMcdJoin,
      gasPrice: web3.utils.toHex(0),
    });

    const balance = await daiContract.methods.balanceOf(receiver).call();
    const daiBalance = balance / 1e18;

    assert.isAtLeast(daiBalance, numbDaiToMint);
  });

  it("it should get pool name", async () => {
    const instance = await DAIPool.deployed();
    const poolName = await instance.getName();
    assert.equal(poolName, "DAI Pool");
  });

  it("it should be no tokens in contract", async () => {
    const instance = await DAIPool.deployed();
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const cDai = await Erc20.at(MainnetAddresses.CDAI_ADDRESS);
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceDai = await Dai.balanceOf(instance.address);
    const balanceCDai = await cDai.balanceOf(instance.address);
    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceDai), 0);
    assert.equal(Number(balanceCDai), 0);
    assert.equal(Number(balanceComp), 0);
  });

  it("it should deposit DAI tokens to contract", async () => {
    const instance = await DAIPool.deployed();
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const cDai = await Erc20.at(MainnetAddresses.CDAI_ADDRESS);
    const sender = accounts[0];
    const amountOfDaiToSupply = 1000;
    const mantissa = web3.utils.toWei(amountOfDaiToSupply.toString(), "ether");

    const balanceDaiSender = await Dai.balanceOf(sender);

    // approve contract and deposit dai
    await Dai.approve(instance.address, mantissa, { from: sender });
    await instance.deposit(mantissa, { from: sender });
    // const result = await instance.deposit(mantissa);
    // console.log(result.events.Log);

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);
    const balancecDaiSenderAfter = await cDai.balanceOf(sender);

    // test
    assert.equal(
      Number(balanceDaiSender),
      Number(balanceDaiSenderAfter) + Number(mantissa)
    );
    assert.equal(Number(balancecDaiSenderAfter), 0);
  });

  it("it should be DAI tokens available in contract", async () => {
    const instance = await DAIPool.deployed();
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const minUnderlyingValueInDai = 25;

    const balanceDai = await Dai.balanceOf(instance.address);

    assert.isAbove(Number(balanceDai), 0);
    assert.isBelow(Number(balanceDai) / 1e18, minUnderlyingValueInDai);
  });

  it("it should be cTokens available in contract", async () => {
    const instance = await DAIPool.deployed();
    const cDai = await Erc20.at(MainnetAddresses.CDAI_ADDRESS);

    const balancecDai = await cDai.balanceOf(instance.address);

    assert.isAbove(Number(balancecDai) / 1e8, 0);
  });

  it("it should be no COMP tokens available in contract", async () => {
    const instance = await DAIPool.deployed();
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceComp), 0);
  });

  it("it should harvest COMP token rewards", async () => {
    const instance = await DAIPool.deployed();
    const sender = accounts[0];

    await instance.harvest({ from: sender });
    // const result = await instance.harvest();
    // console.log(result.events.Harvest);
  });

  it("it should be COMP tokens available in contract", async () => {
    const instance = await DAIPool.deployed();
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceComp = await Comp.balanceOf(instance.address);

    assert.isAbove(Number(balanceComp), 0);
  });

  it("it should withdraw all DAI tokens from contract and swap COMP tokens", async () => {
    const instance = await DAIPool.deployed();
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];
    const amountOfDaiToSupply = 1000 * 5;
    const mantissa = web3.utils.toWei(amountOfDaiToSupply.toString(), "ether");

    const balanceDaiSender = await Dai.balanceOf(sender);

    // approve contract to repay borrow
    await Dai.approve(instance.address, mantissa, { from: sender });
    await instance.withdrawAll({ from: sender });
    // const result = await instance.withdrawAll({ from: sender });
    // console.log(result.events.Log);

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);

    assert.isBelow(Number(balanceDaiSender), Number(balanceDaiSenderAfter));
  });

  it("it should be no tokens in contract after withdrawal", async () => {
    const instance = await DAIPool.deployed();
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const cDai = await Erc20.at(MainnetAddresses.CDAI_ADDRESS);
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceDai = await Dai.balanceOf(instance.address);
    const balanceCDai = await cDai.balanceOf(instance.address);
    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceDai), 0);
    assert.equal(Number(balanceCDai), 0);
    assert.equal(Number(balanceComp), 0);
  });
});
