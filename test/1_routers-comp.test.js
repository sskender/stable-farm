/* eslint-disable no-undef */
const { assert } = require("chai");

const MainnetAddresses = require("./mainnet.addresses");
const daiAbi = require("./abi/dai-abi.json");
const erc20Abi = require("./abi/erc20-abi.json");

const CompoundRouter = artifacts.require("CompoundRouter");
const Erc20 = artifacts.require("Erc20");

contract("Compound Router - DAI", async (accounts) => {
  var initialSenderBalance;
  var instance;

  it("it should deploy contract", async () => {
    instance = await CompoundRouter.new(
      MainnetAddresses.COMPTROLLER_ADDRESS,
      MainnetAddresses.DAI_ADDRESS,
      MainnetAddresses.CDAI_ADDRESS,
      MainnetAddresses.UNISWAP_ROUTER_02
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
    const scaledAPY = Number(APY) / rayUnitsExponent;

    assert.isAbove(scaledAPY, 0.05);
    assert.isBelow(scaledAPY, 100);
  });

  it("it should be no tokens available in contract", async () => {
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
    assert.equal(balanceDaiSender, initialSenderBalance);
    assert.equal(
      Number(balanceDaiSender),
      Number(balanceDaiSenderAfter) + Number(mantissa)
    );
    assert.equal(Number(balancecDaiSenderAfter), 0);
  });

  it("it should be no DAI tokens available in contract", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);

    const balanceDai = await Dai.balanceOf(instance.address);

    assert.equal(Number(balanceDai), 0);
  });

  it("it should be cTokens available in contract", async () => {
    const cDai = await Erc20.at(MainnetAddresses.CDAI_ADDRESS);

    const balancecDai = await cDai.balanceOf(instance.address);

    assert.isAbove(Number(balancecDai) / 1e8, 0);
  });

  it("it should be no COMP tokens available in contract", async () => {
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceComp), 0);
  });

  it("it should harvest COMP token rewards", async () => {
    const sender = accounts[0];

    await instance.harvest({ from: sender });
    // const result = await instance.harvest();
    // console.log(result.events.Harvest);
  });

  it("it should be swapped DAI tokens available in contract", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);

    const balanceDai = await Dai.balanceOf(instance.address);

    assert.isAbove(Number(balanceDai), 0);
  });

  it("it should withdraw all DAI tokens from contract", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];

    const balanceDaiSender = await Dai.balanceOf(sender);

    await instance.withdraw({ from: sender });
    // const result = await instance.withdrawAll({ from: sender });
    // console.log(result.events.Log);

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);

    assert.isBelow(Number(balanceDaiSender), Number(balanceDaiSenderAfter));
    assert.isBelow(Number(initialSenderBalance), Number(balanceDaiSenderAfter));
  });

  it("it should be no tokens in contract after withdrawal", async () => {
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

contract("Compound Router - USDC", async (accounts) => {
  var initialSenderBalance;
  var instance;

  it("it should deploy contract", async () => {
    instance = await CompoundRouter.new(
      MainnetAddresses.COMPTROLLER_ADDRESS,
      MainnetAddresses.USDC_ADDRESS,
      MainnetAddresses.CUSDC_ADDRESS,
      MainnetAddresses.UNISWAP_ROUTER_02
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
    const scaledAPY = Number(APY) / rayUnitsExponent;

    assert.isAbove(scaledAPY, 0.05);
    assert.isBelow(scaledAPY, 100);
  });

  it("it should be no tokens available in contract", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);
    const cUsdc = await Erc20.at(MainnetAddresses.CUSDC_ADDRESS);
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceUsdc = await Usdc.balanceOf(instance.address);
    const balanceCUsdc = await cUsdc.balanceOf(instance.address);
    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceUsdc), 0);
    assert.equal(Number(balanceCUsdc), 0);
    assert.equal(Number(balanceComp), 0);
  });

  it("it should deposit USDC tokens to contract", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);
    const cUsdc = await Erc20.at(MainnetAddresses.CUSDC_ADDRESS);
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
    const balancecUsdcSenderAfter = await cUsdc.balanceOf(sender);

    // test
    assert.equal(Number(balanceUsdcSender), initialSenderBalance);
    assert.equal(
      Number(balanceUsdcSender),
      Number(balanceUsdcSenderAfter) + Number(mantissa)
    );
    assert.equal(Number(balancecUsdcSenderAfter), 0);
  });

  it("it should be no USDC tokens available in contract", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);

    const balanceUsdc = await Usdc.balanceOf(instance.address);

    assert.equal(Number(balanceUsdc), 0);
  });

  it("it should be cTokens available in contract", async () => {
    const cUsdc = await Erc20.at(MainnetAddresses.CUSDC_ADDRESS);

    const balancecUsdc = await cUsdc.balanceOf(instance.address);

    assert.isAbove(Number(balancecUsdc) / 1e8, 0);
  });

  it("it should be no COMP tokens available in contract", async () => {
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceComp), 0);
  });

  it("it should harvest COMP token rewards", async () => {
    const sender = accounts[0];

    await instance.harvest({ from: sender });
    // const result = await instance.harvest();
    // console.log(result.events.Harvest);
  });

  it("it should be swapped USDC tokens available in contract", async () => {
    const Usdc = await Erc20.at(MainnetAddresses.USDC_ADDRESS);

    const balanceUsdc = await Usdc.balanceOf(instance.address);

    assert.isAbove(Number(balanceUsdc), 0);
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
    const cUsdc = await Erc20.at(MainnetAddresses.CUSDC_ADDRESS);
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceUsdc = await Usdc.balanceOf(instance.address);
    const balanceCUsdc = await cUsdc.balanceOf(instance.address);
    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceUsdc), 0);
    assert.equal(Number(balanceCUsdc), 0);
    assert.equal(Number(balanceComp), 0);
  });
});

/*
contract("Compound Router - USDT", async (accounts) => {
  var initialSenderBalance;
  var instance;

  it("it should deploy contract", async () => {
    instance = await CompoundRouter.new(
      MainnetAddresses.COMPTROLLER_ADDRESS,
      MainnetAddresses.USDT_ADDRESS,
      MainnetAddresses.CUSDT_ADDRESS,
      MainnetAddresses.UNISWAP_ROUTER_02
    );

    assert.notEqual(instance.address, undefined);
  });

  it("it should mint USDT test tokens to account", async () => {
    const cusdtAddress = MainnetAddresses.CUSDT_ADDRESS;
    const usdtAddress = MainnetAddresses.USDT_ADDRESS;
    const underlyingDecimals = 6;

    const receiver = accounts[0];
    const numbTokensToMint = 10000;

    const usdtContract = new web3.eth.Contract(erc20Abi, usdtAddress);
    const mantissa = (
      numbTokensToMint * Math.pow(10, underlyingDecimals)
    ).toString();

    await usdtContract.methods.transfer(receiver, mantissa).send({
      from: cusdtAddress,
      gasPrice: web3.utils.toHex(0),
      gas: 3000000,
    });

    const balance = await usdtContract.methods.balanceOf(receiver).call();
    const usdtBalance = balance / Math.pow(10, underlyingDecimals);
    initialSenderBalance = Number(balance);

    assert.isAtLeast(usdtBalance, numbTokensToMint);
  });

  it("it should get USDT as underlying asset", async () => {
    const underlyingAsset = await instance.getUnderlyingAsset();

    assert.equal(underlyingAsset, MainnetAddresses.USDT_ADDRESS);
  });

  it("it should get number of decimals for USDT", async () => {
    const _underlyingDecimals = 6;
    const underlyingDecimals = await instance.getUnderlyingDecimals();

    assert.equal(_underlyingDecimals, underlyingDecimals);
  });

  it("it should get supply APY for USDT", async () => {
    const rayUnitsExponent = 1e27;
    const APY = await instance.getCurrentAPY();
    const scaledAPY = Number(APY) / rayUnitsExponent;

    assert.isAbove(scaledAPY, 0.05);
    assert.isBelow(scaledAPY, 100);
  });

  it("it should be no tokens available in contract", async () => {
    const Usdt = await Erc20.at(MainnetAddresses.USDT_ADDRESS);
    const cUsdt = await Erc20.at(MainnetAddresses.CUSDT_ADDRESS);
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceUsdt = await Usdt.balanceOf(instance.address);
    const balanceCUsdt = await cUsdt.balanceOf(instance.address);
    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceUsdt), 0);
    assert.equal(Number(balanceCUsdt), 0);
    assert.equal(Number(balanceComp), 0);
  });

  it("it should deposit USDT tokens to contract", async () => {
    const Usdt = await Erc20.at(MainnetAddresses.USDT_ADDRESS);
    const cUsdt = await Erc20.at(MainnetAddresses.CUSDT_ADDRESS);
    const sender = accounts[0];
    const amountToSupply = 1000;
    const underlyingDecimals = 6;
    const mantissa = (
      amountToSupply * Math.pow(10, underlyingDecimals)
    ).toString();

    const balanceUsdtSender = await Usdt.balanceOf(sender);

    // approve contract and deposit usdt
    await Usdt.approve(instance.address, mantissa, { from: sender });
    await instance.deposit(mantissa, { from: sender });
    // const result = await instance.deposit(mantissa);
    // console.log(result.events.Log);

    const balanceUsdtSenderAfter = await Usdt.balanceOf(sender);
    const balancecUsdtSenderAfter = await cUsdt.balanceOf(sender);

    // test
    assert.equal(balanceUsdtSender, initialSenderBalance);
    assert.equal(
      Number(balanceUsdtSender),
      Number(balanceUsdtSenderAfter) + Number(mantissa)
    );
    assert.equal(Number(balancecUsdtSenderAfter), 0);
  });

  it("it should be no USDT tokens available in contract", async () => {
    const Usdt = await Erc20.at(MainnetAddresses.USDT_ADDRESS);

    const balance = await Usdt.balanceOf(instance.address);

    assert.equal(Number(balance), 0);
  });

  it("it should be cTokens available in contract", async () => {
    const cUsdt = await Erc20.at(MainnetAddresses.CUSDT_ADDRESS);

    const balancecUsdt = await cUsdt.balanceOf(instance.address);

    assert.isAbove(Number(balancecUsdt) / 1e8, 0);
  });

  it("it should be no COMP tokens available in contract", async () => {
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceComp), 0);
  });

  it("it should harvest COMP token rewards", async () => {
    const sender = accounts[0];

    await instance.harvest({ from: sender });
    // const result = await instance.harvest();
    // console.log(result.events.Harvest);
  });

  it("it should be swapped USDT tokens available in contract", async () => {
    const Usdt = await Erc20.at(MainnetAddresses.USDT_ADDRESS);

    const balance = await Usdt.balanceOf(instance.address);

    assert.isAbove(Number(balance), 0);
  });

  it("it should withdraw all USDT tokens from contract", async () => {
    const Usdt = await Erc20.at(MainnetAddresses.USDT_ADDRESS);
    const sender = accounts[0];

    const balanceUsdtSender = await Usdt.balanceOf(sender);

    await instance.withdraw({ from: sender });
    // const result = await instance.withdrawAll({ from: sender });
    // console.log(result.events.Log);

    const balanceUsdtSenderAfter = await Usdt.balanceOf(sender);

    assert.isBelow(Number(balanceUsdtSender), Number(balanceUsdtSenderAfter));
    assert.isBelow(
      Number(initialSenderBalance),
      Number(balanceUsdtSenderAfter)
    );
  });

  it("it should be no tokens in contract after withdrawal", async () => {
    const Usdt = await Erc20.at(MainnetAddresses.USDT_ADDRESS);
    const cUsdt = await Erc20.at(MainnetAddresses.CUSDT_ADDRESS);
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);

    const balanceUsdt = await Usdt.balanceOf(instance.address);
    const balanceCUsdt = await cUsdt.balanceOf(instance.address);
    const balanceComp = await Comp.balanceOf(instance.address);

    assert.equal(Number(balanceUsdt), 0);
    assert.equal(Number(balanceCUsdt), 0);
    assert.equal(Number(balanceComp), 0);
  });
});
*/
