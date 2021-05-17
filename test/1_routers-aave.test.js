/* eslint-disable no-undef */
const { assert } = require("chai");

const MainnetAddresses = require("./mainnet.addresses");
const daiAbi = require("./abi/dai-abi.json");
const erc20Abi = require("./abi/erc20-abi.json");

const AAVERouter = artifacts.require("AAVERouter");
const Erc20 = artifacts.require("Erc20");

contract("AAVE Router - DAI", async (accounts) => {
  var initialSenderBalance;
  var instance;

  it("it should deploy contract", async () => {
    instance = await AAVERouter.new(
      MainnetAddresses.AAVE_LENDING_POOL_ADDRESS_PROVIDER,
      MainnetAddresses.DAI_ADDRESS
    );

    assert.notEqual(instance.address, undefined);
  });

  it("it should mint DAI test tokens to account", async () => {
    const daiMcdJoin = MainnetAddresses.DAI_MCD_JOIN;
    const daiAddress = MainnetAddresses.DAI_ADDRESS;

    const receiver = accounts[0];
    const numbTokensToMint = 10000;

    const daiContract = new web3.eth.Contract(daiAbi, daiAddress);
    const mantissa = web3.utils.toWei(numbTokensToMint.toString(), "ether");

    await daiContract.methods.mint(receiver, mantissa).send({
      from: daiMcdJoin,
      gasPrice: web3.utils.toHex(0),
    });

    const balance = await daiContract.methods.balanceOf(receiver).call();
    const daiBalance = balance / 1e18;
    initialSenderBalance = Number(balance);

    assert.isAtLeast(daiBalance, numbTokensToMint);
  });

  it("it should get DAI as underlying asset", async () => {
    const underlyingAsset = await instance.getUnderlyingAsset();

    assert.equal(underlyingAsset, MainnetAddresses.DAI_ADDRESS);
  });

  it("it should get number of decimals for DAI", async () => {
    const daiUnderlyingDecimals = 18;
    const underlyingDecimals = await instance.getUnderlyingDecimals();

    assert.equal(daiUnderlyingDecimals, underlyingDecimals);
  });

  it("it should get supply APY for DAI", async () => {
    const rayUnitsExponent = 1e27;
    const APY = await instance.getCurrentAPY();
    const scaledAPY = (Number(APY) / rayUnitsExponent) * 100;

    assert.isAbove(scaledAPY, 0.05);
    assert.isBelow(scaledAPY, 100);
  });

  it("it should be no tokens available in contract", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);

    const balanceDai = await Dai.balanceOf(instance.address);

    assert.equal(Number(balanceDai), 0);
  });

  it("it should deposit DAI tokens to contract", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
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

    // test
    assert.equal(balanceDaiSender, initialSenderBalance);
    assert.equal(
      Number(balanceDaiSender),
      Number(balanceDaiSenderAfter) + Number(mantissa)
    );
  });

  it("it should be no DAI tokens available in contract", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);

    const balanceDai = await Dai.balanceOf(instance.address);

    assert.equal(Number(balanceDai), 0);
  });

  it("it should withdraw all DAI tokens from contract", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];

    const balanceDaiSender = await Dai.balanceOf(sender);

    await instance.withdraw({ from: sender });
    // const result = await instance.withdraw({ from: sender });
    // console.log(result.events.Log);

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);

    assert.isBelow(Number(balanceDaiSender), Number(balanceDaiSenderAfter));
    assert.isBelow(Number(initialSenderBalance), Number(balanceDaiSenderAfter));
  });

  it("it should be no tokens in contract after withdrawal", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);

    const balanceDai = await Dai.balanceOf(instance.address);

    assert.equal(Number(balanceDai), 0);
  });
});

contract("AAVE Router - USDC", async (accounts) => {
  var initialSenderBalance;
  var instance;

  it("it should deploy contract", async () => {
    instance = await AAVERouter.new(
      MainnetAddresses.AAVE_LENDING_POOL_ADDRESS_PROVIDER,
      MainnetAddresses.USDC_ADDRESS
    );

    assert.notEqual(instance.address, undefined);
  });

  it("it should mint USDC test tokens to account", async () => {
    const usdcAddress = MainnetAddresses.USDC_ADDRESS;
    const cusdcAddress = MainnetAddresses.CUSDC_ADDRESS;
    const underlyingDecimals = 6;

    const receiver = accounts[0];
    const numbTokensToMint = 10000;

    const usdcContract = new web3.eth.Contract(erc20Abi, usdcAddress);
    const mantissa = (
      numbTokensToMint * Math.pow(10, underlyingDecimals)
    ).toString();

    await usdcContract.methods.transfer(receiver, mantissa).send({
      from: cusdcAddress,
      gasPrice: web3.utils.toHex(0),
      gas: 3000000,
    });

    const balance = await usdcContract.methods.balanceOf(receiver).call();
    const usdcBalance = balance / Math.pow(10, underlyingDecimals);
    initialSenderBalance = Number(balance);

    assert.isAtLeast(usdcBalance, numbTokensToMint);
  });

  it("it should get USDC as underlying asset", async () => {
    const underlyingAsset = await instance.getUnderlyingAsset();

    assert.equal(underlyingAsset, MainnetAddresses.USDC_ADDRESS);
  });

  it("it should get number of decimals for USDC", async () => {
    const usdcUnderlyingDecimals = 6;
    const underlyingDecimals = await instance.getUnderlyingDecimals();

    assert.equal(usdcUnderlyingDecimals, underlyingDecimals);
  });

  it("it should get supply APY for USDC", async () => {
    const rayUnitsExponent = 1e27;
    const APY = await instance.getCurrentAPY();
    const scaledAPY = (Number(APY) / rayUnitsExponent) * 100;

    assert.isAbove(scaledAPY, 0.05);
    assert.isBelow(scaledAPY, 100);
  });

  it("it should be no tokens available in contract", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);

    const balanceUsdc = await Usdc.balanceOf(instance.address);

    assert.equal(Number(balanceUsdc), 0);
  });

  it("it should deposit USDC tokens to contract", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);
    const sender = accounts[0];
    const amountOfUsdcToSupply = 1000;
    const underlyingDecimals = 6;
    const mantissa = (
      amountOfUsdcToSupply * Math.pow(10, underlyingDecimals)
    ).toString();

    const balanceUsdcSender = await Usdc.balanceOf(sender);

    // approve contract and deposit dai
    await Usdc.approve(instance.address, mantissa, { from: sender });
    await instance.deposit(mantissa, { from: sender });
    // const result = await instance.deposit(mantissa);
    // console.log(result.events.Log);

    const balanceUsdcSenderAfter = await Usdc.balanceOf(sender);

    // test
    assert.equal(Number(balanceUsdcSender), initialSenderBalance);
    assert.equal(
      Number(balanceUsdcSender),
      Number(balanceUsdcSenderAfter) + Number(mantissa)
    );
  });

  it("it should be no USDC tokens available in contract", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);

    const balanceUsdc = await Usdc.balanceOf(instance.address);

    assert.equal(Number(balanceUsdc), 0);
  });

  it("it should withdraw all USDC tokens from contract", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);
    const sender = accounts[0];

    const balanceUsdcSender = await Usdc.balanceOf(sender);

    await instance.withdraw({ from: sender });
    // const result = await instance.withdrawAll({ from: sender });
    // console.log(result.events.Log);

    const balanceUsdcSenderAfter = await Usdc.balanceOf(sender);

    assert.isBelow(Number(balanceUsdcSender), Number(balanceUsdcSenderAfter));
    assert.isBelow(
      Number(initialSenderBalance),
      Number(balanceUsdcSenderAfter)
    );
  });

  it("it should be no tokens in contract after withdrawal", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);

    const balanceUsdc = await Usdc.balanceOf(instance.address);

    assert.equal(Number(balanceUsdc), 0);
  });
});
