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

    const daiContract = new web3.eth.Contract(daiAbi, daiAddress);
    const numbDaiToMint = web3.utils.toWei("1000", "ether");

    await daiContract.methods.mint(accounts[0], numbDaiToMint).send({
      from: daiMcdJoin,
      gasPrice: web3.utils.toHex(0),
    });

    const balance = await daiContract.methods.balanceOf(accounts[0]).call();
    const dai = balance / 1e18;

    assert.isAtLeast(dai, 1000);
  });

  it("it should mint test COMP tokens", async () => {
    const compAddress = MainnetAddresses.COMP_ADDRESS;
    const cCompAddress = MainnetAddresses.CCOMP_ADDRESS;

    const compContract = new web3.eth.Contract(erc20Abi, compAddress);
    const numbCompToMint = web3.utils.toWei("10", "ether");

    await compContract.methods.transfer(accounts[0], numbCompToMint).send({
      from: cCompAddress,
      gasPrice: web3.utils.toHex(0),
      gas: 3000000,
    });

    const balance = await compContract.methods.balanceOf(accounts[0]).call();
    const comp = balance / 1e18;

    assert.isAtLeast(comp, 10);
  });

  it("it should transfer COMP tokens to contract", async () => {
    const instance = await Uniswap.deployed();
    const Comp = await Erc20.at(MainnetAddresses.COMP_ADDRESS);
    const sender = accounts[0];
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
    assert.isAtLeast(Number(balanceUser), 10 * 1e18);
    assert.equal(Number(balanceContract), 0);
    assert.isAtLeast(Number(balanceUserAfter), 8 * 1e18);
    assert.equal(Number(balanceContractAfter), 2 * 1e18);
    assert.isBelow(Number(balanceUserAfter), Number(balanceUser));
    assert.isAbove(Number(balanceContractAfter), Number(balanceContract));
  });

  it("it should swap COMP tokens for DAI tokens", async () => {
    const instance = await Uniswap.deployed();
  });
});
