const Uniswap = artifacts.require("Uniswap");
const DAIPool = artifacts.require("DAIPool");

const MainnetAddresses = require("./../test/mainnet.addresses");

module.exports = async (deployer) => {
  await deployer.deploy(Uniswap);
  await deployer.deploy(
    DAIPool,
    MainnetAddresses.COMPTROLLER_ADDRESS,
    MainnetAddresses.CDAI_ADDRESS,
    MainnetAddresses.DAI_ADDRESS,
    MainnetAddresses.ORACLE_PRICE_FEED_ADDRESS,
    MainnetAddresses.UNISWAP_ROUTER_02
  );
};
