/* eslint-disable no-undef */
const { assert, expect } = require("chai");

const MainnetAddresses = require("./mainnet.addresses");
const daiAbi = require("./abi/dai-abi.json");

const StablecoinMixedPool = artifacts.require("StablecoinMixedPool");
const CompoundRouter = artifacts.require("CompoundRouter");
const Erc20 = artifacts.require("Erc20");

contract("Pool - DAI", async (accounts) => {
  var initialSenderBalance;
  var daiCompoundRouter;
  var usdcCompoundRouter;
  var instance;

  it("it should deploy DAI Compound Router", async () => {
    daiCompoundRouter = await CompoundRouter.new(
      MainnetAddresses.COMPTROLLER_ADDRESS,
      MainnetAddresses.DAI_ADDRESS,
      MainnetAddresses.CDAI_ADDRESS,
      MainnetAddresses.UNISWAP_ROUTER_02
    );

    assert.notEqual(daiCompoundRouter.address, undefined);
  });

  it("it should deploy USDC Compound Router", async () => {
    usdcCompoundRouter = await CompoundRouter.new(
      MainnetAddresses.COMPTROLLER_ADDRESS,
      MainnetAddresses.USDC_ADDRESS,
      MainnetAddresses.CUSDC_ADDRESS,
      MainnetAddresses.UNISWAP_ROUTER_02
    );

    assert.notEqual(usdcCompoundRouter.address, undefined);
    assert.notEqual(daiCompoundRouter.address, usdcCompoundRouter.address);
  });

  it("it should deploy DAI pool", async () => {
    instance = await StablecoinMixedPool.new(
      MainnetAddresses.DAI_ADDRESS,
      MainnetAddresses.UNISWAP_ROUTER_02
    );

    assert.notEqual(instance.address, undefined);
    assert.notEqual(instance.address, daiCompoundRouter.address);
    assert.notEqual(instance.address, usdcCompoundRouter.address);
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

  it("it should add router", async () => {
    await instance.addRouter(daiCompoundRouter.address);
    await instance.addRouter(usdcCompoundRouter.address);
  });

  it("it should not add duplicated router", async () => {
    let duplicateError = false;
    try {
      await instance.addRouter(daiCompoundRouter.address);
    } catch (error) {
      duplicateError = true;
    }

    assert.equal(duplicateError, true);
  });

  it("it should get routers", async () => {
    const routersAdded = 2;

    const routers = await instance.getRouters();

    assert.equal(routers.length, routersAdded);
    expect(routers).to.have.members([
      daiCompoundRouter.address,
      usdcCompoundRouter.address,
    ]);
  });

  it("it should get underlying asset address", async () => {
    const address = await instance.getAssetAddress();

    assert.equal(address, MainnetAddresses.DAI_ADDRESS);
  });

  it("it should get underlying asset name", async () => {
    const tokenName = "Dai Stablecoin";
    const name = await instance.getAssetName();

    assert.equal(name, tokenName);
  });

  it("it should get underlying asset symbol", async () => {
    const tokenSymbol = "DAI";
    const symbol = await instance.getAssetSymbol();

    assert.equal(symbol, tokenSymbol);
  });

  it("it should get APY before router initialization", async () => {
    const APY = await instance.getAPY();

    assert.equal(Number(APY), 0);
  });

  it("it should get best APY", async () => {
    const result = await instance.getBestAPY();
    const routerAddress = result[0];
    const APY = Number(result[1]) / 1e2;
    const validAddresses = [
      daiCompoundRouter.address,
      usdcCompoundRouter.address,
    ];

    expect(validAddresses).to.include(routerAddress);
    assert.isAbove(APY, 0);
    assert.isBelow(APY, 100);
  });

  it("it should fail to withdraw all", async () => {
    const sender = accounts[0];
    let failed = false;

    try {
      await instance.withdrawAll({ from: sender });
    } catch (error) {
      failed = true;
    }

    assert.equal(failed, true);
  });

  it("it should fail to withdraw any amount", async () => {
    const amountOfDaiToWithdraw = 100;
    const mantissa = web3.utils.toWei(
      amountOfDaiToWithdraw.toString(),
      "ether"
    );
    const sender = accounts[0];
    let failed = false;

    try {
      await instance.withdraw(mantissa, { from: sender });
    } catch (error) {
      failed = true;
    }

    assert.equal(failed, true);
  });

  it("it should deposit DAI", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];
    const amountOfDaiToSupply = 100;
    const mantissa = web3.utils.toWei(amountOfDaiToSupply.toString(), "ether");
    const balanceDaiSenderBefore = await Dai.balanceOf(sender);

    // approve contract and deposit dai
    await Dai.approve(instance.address, mantissa, { from: sender });
    await instance.deposit(mantissa, { from: sender });
    // const result = await instance.deposit(mantissa);
    // console.log(result.events.Log);

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);

    // assert.equal(Number(balanceDaiSenderBefore), Number(balanceDaiSenderAfter)+Number(mantissa));
    assert.equal(
      Math.trunc(Number(balanceDaiSenderBefore) / 1e18),
      Math.trunc(Number(balanceDaiSenderAfter) / 1e18) +
        Math.trunc(Number(mantissa) / 1e18)
    );
  });

  it("it should get current APY as the best APY", async () => {
    const currentAPY = await instance.getAPY();
    const bestAPYRouter = await instance.getBestAPY();

    const currentAPYScaled = Math.trunc(Number(currentAPY) / 1e25);
    const bestAPY = Number(bestAPYRouter[1]);

    assert.equal(currentAPYScaled, bestAPY);
  });

  it("it should deposit more DAI", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];
    const amountOfDaiToSupply = 200;
    const mantissa = web3.utils.toWei(amountOfDaiToSupply.toString(), "ether");
    const balanceDaiSenderBefore = await Dai.balanceOf(sender);

    // approve contract and deposit dai
    await Dai.approve(instance.address, mantissa, { from: sender });
    await instance.deposit(mantissa, { from: sender });
    // const result = await instance.deposit(mantissa);
    // console.log(result.events.Log);

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);

    // assert.equal(Number(balanceDaiSenderBefore), Number(balanceDaiSenderAfter)+Number(mantissa));
    assert.equal(
      Math.trunc(Number(balanceDaiSenderBefore) / 1e18),
      Math.trunc(Number(balanceDaiSenderAfter) / 1e18) +
        Math.trunc(Number(mantissa) / 1e18)
    );
  });

  it("it should withdraw some DAI", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];
    const amountOfDaiSupplied = 75;
    const mantissa = web3.utils.toWei(amountOfDaiSupplied.toString(), "ether");
    const daiMinTolerance = 0.95; // 95% of DAI left after slippage

    const balanceDaiSenderBefore = await Dai.balanceOf(sender);
    const daiBefore = Number(balanceDaiSenderBefore) / 1e18;

    await instance.withdraw(mantissa, { from: sender });

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);
    const daiAfter = Number(balanceDaiSenderAfter) / 1e18;
    const totalDaiShouldBeAfter =
      (daiBefore + amountOfDaiSupplied) * daiMinTolerance;

    assert.isAbove(daiAfter, totalDaiShouldBeAfter);
  });

  it("it should deposit more DAI", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];
    const amountOfDaiToSupply = 200;
    const mantissa = web3.utils.toWei(amountOfDaiToSupply.toString(), "ether");
    const balanceDaiSenderBefore = await Dai.balanceOf(sender);

    // approve contract and deposit dai
    await Dai.approve(instance.address, mantissa, { from: sender });
    await instance.deposit(mantissa, { from: sender });
    // const result = await instance.deposit(mantissa);
    // console.log(result.events.Log);

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);

    // assert.equal(Number(balanceDaiSenderBefore), Number(balanceDaiSenderAfter)+Number(mantissa));
    assert.equal(
      Math.trunc(Number(balanceDaiSenderBefore) / 1e18),
      Math.trunc(Number(balanceDaiSenderAfter) / 1e18) +
        Math.trunc(Number(mantissa) / 1e18)
    );
  });

  it("it should withdraw all DAI", async () => {
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);
    const sender = accounts[0];
    const daiMinTolerance = 0.95; // 95% of DAI left after slippage

    await instance.withdrawAll({ from: sender });

    const balanceDaiSenderAfter = await Dai.balanceOf(sender);
    const daiAfter = Number(balanceDaiSenderAfter) / 1e18;

    assert.isAbove(daiAfter, (initialSenderBalance / 1e18) * daiMinTolerance);
  });
});
