const DAICompoundLeveragePool = artifacts.require("DAICompoundLeveragePool");

const MainnetAddresses = require("./../scripts/mainnet_addresses");

module.exports = async (deployer) => {
  await deployer.deploy(
    DAICompoundLeveragePool,
    MainnetAddresses.COMPTROLLER_ADDRESS,
    MainnetAddresses.CDAI_ADDRESS,
    MainnetAddresses.DAI_ADDRESS,
    MainnetAddresses.ORACLE_PRICE_FEED_ADDRESS
  );
};
