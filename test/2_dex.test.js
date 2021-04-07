/* eslint-disable no-undef */
const MainnetAddresses = require("./mainnet.addresses");
const daiAbi = require("./abi/dai-abi.json");
const erc20Abi = require("./abi/erc20-abi.json");

const Erc20 = artifacts.require("Erc20");
const Uniswap = artifacts.require("Uniswap");

contract("Uniswap DEX", async (accounts) => {
  it("it should mint test DAI tokens", async () => {
    const daiMcdJoin = MainnetAddresses.DAI_MCD_JOIN;
    const daiAddress = MainnetAddresses.DAI_ADDRESS;

    const receiver = accounts[0];
    const numbDaiToMint = 1000;

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

  it("it should mint test COMP tokens", async () => {
    const compAddress = MainnetAddresses.COMP_ADDRESS;
    const cCompAddress = MainnetAddresses.CCOMP_ADDRESS;

    const receiver = accounts[0];
    const numbCompToMint = 10;

    const compContract = new web3.eth.Contract(erc20Abi, compAddress);
    const mantissa = web3.utils.toWei(numbCompToMint.toString(), "ether");

    await compContract.methods.transfer(receiver, mantissa).send({
      from: cCompAddress,
      gasPrice: web3.utils.toHex(0),
      gas: 3000000,
    });

    const balance = await compContract.methods.balanceOf(receiver).call();
    const compBalance = balance / 1e18;

    assert.isAtLeast(compBalance, numbCompToMint);
  });

  it("it should transfer COMP tokens to contract", async () => {
    const instance = await Uniswap.deployed();
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);
    const sender = accounts[0];
    const tokensOnSenderAccount = 10;
    const tokensToTransfer = 2;

    const valueToTransfer = web3.utils.toWei(
      tokensToTransfer.toString(),
      "ether"
    );

    const balanceUser = await Comp.balanceOf(sender);
    const balanceContract = await Comp.balanceOf(instance.address);

    await Comp.transfer(instance.address, valueToTransfer, { from: sender });

    const balanceUserAfter = await Comp.balanceOf(sender);
    const balanceContractAfter = await Comp.balanceOf(instance.address);

    // test
    assert.isAtLeast(Number(balanceUser), tokensOnSenderAccount * 1e18);
    assert.equal(Number(balanceContract), 0);
    assert.isAtLeast(
      Number(balanceUserAfter),
      (tokensOnSenderAccount - tokensToTransfer) * 1e18
    );
    assert.equal(Number(balanceContractAfter), tokensToTransfer * 1e18);
    assert.isBelow(Number(balanceUserAfter), Number(balanceUser));
    assert.isAbove(Number(balanceContractAfter), Number(balanceContract));
  });

  it("it should swap COMP tokens for DAI tokens", async () => {
    const instance = await Uniswap.deployed();
    const sender = accounts[0];
    const amountOfCompToSwap = 2;

    const amountIn = web3.utils.toWei(amountOfCompToSwap.toString(), "ether");

    await instance.swapTokensAForTokensB(
      MainnetAddresses.COMP_ADDRESS,
      MainnetAddresses.DAI_ADDRESS,
      MainnetAddresses.UNISWAP_ROUTER_02,
      amountIn,
      { from: sender }
    );
    // const result = await instance.swapTokensAForTokensB(
    //   MainnetAddresses.COMP_ADDRESS,
    //   MainnetAddresses.DAI_ADDRESS,
    //   MainnetAddresses.UNISWAP_ROUTER_02,
    //   amountIn,
    //   { from: sender }
    // );
    // console.log(result.events.Log);
  });

  it("it should be DAI tokens available", async () => {
    const instance = await Uniswap.deployed();
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);
    const Dai = await Erc20.at(MainnetAddresses.DAI_ADDRESS);

    const balanceComp = await Comp.balanceOf(instance.address);
    const balanceDai = await Dai.balanceOf(instance.address);

    assert.equal(Number(balanceComp), 0);
    assert.isAbove(Number(balanceDai) / 1e18, 0);
  });
});
