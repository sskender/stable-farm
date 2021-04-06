/* eslint-disable no-undef */
const MainnetAddresses = require("./mainnet.addresses");
const daiAbi = require("./abi/dai-abi.json");
const erc20Abi = require("./abi/erc20-abi.json");

contract("Uniswap DEX", async (accounts) => {
  it("it should mint 1000 test DAI tokens", async () => {
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

  it("it should mint 10 test COMP tokens", async () => {
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
});
