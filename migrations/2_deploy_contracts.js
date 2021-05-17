/* eslint-disable no-undef */
const MainnetAddresses = require("./../test/mainnet.addresses");

const CompoundRouter = artifacts.require("CompoundRouter");
const AAVERouter = artifacts.require("AAVERouter");

const DAIPool = artifacts.require("DAIPool");
const USDCPool = artifacts.require("USDCPool");

module.exports = async (deployer) => {
  /**
   *
   * DAI POOL
   *
   */

  // DAI Compund Router
  const daiCompoundRouter = await CompoundRouter.new(
    MainnetAddresses.COMPTROLLER_ADDRESS,
    MainnetAddresses.DAI_ADDRESS,
    MainnetAddresses.CDAI_ADDRESS,
    MainnetAddresses.UNISWAP_ROUTER_02
  );

  console.log(`Deployed DAI Compound Router: ${daiCompoundRouter.address}`);

  // DAI AAVE Router
  const daiAAVERouter = await AAVERouter.new(
    MainnetAddresses.AAVE_LENDING_POOL_ADDRESS_PROVIDER,
    MainnetAddresses.DAI_ADDRESS
  );

  console.log(`Deployed DAI AAVE Router: ${daiAAVERouter.address}`);

  // DAI Pool
  const DAIPoolInstance = await deployer.deploy(DAIPool);
  await DAIPoolInstance.addRouter(daiCompoundRouter.address);
  await DAIPoolInstance.addRouter(daiAAVERouter.address);

  const daiRouters = await DAIPoolInstance.getRouters();
  console.log(`Available routers for DAI pool: ${daiRouters}`);

  /**
   *
   * USDC POOL
   *
   */

  // USDC Compound Router
  const usdcCompoundRouter = await CompoundRouter.new(
    MainnetAddresses.COMPTROLLER_ADDRESS,
    MainnetAddresses.USDC_ADDRESS,
    MainnetAddresses.CUSDC_ADDRESS,
    MainnetAddresses.UNISWAP_ROUTER_02
  );

  console.log(`Deployed USDC Compound Router: ${usdcCompoundRouter.address}`);

  // USDC AAVE Router
  const usdcAAVERouter = await AAVERouter.new(
    MainnetAddresses.AAVE_LENDING_POOL_ADDRESS_PROVIDER,
    MainnetAddresses.USDC_ADDRESS
  );

  console.log(`Deployed USDC AAVE Router: ${usdcAAVERouter.address}`);

  // USDC Pool
  const USDCPoolInstance = await deployer.deploy(USDCPool);
  await USDCPoolInstance.addRouter(usdcCompoundRouter.address);
  await USDCPoolInstance.addRouter(usdcAAVERouter.address);

  const usdcRouters = await USDCPoolInstance.getRouters();
  console.log(`Available routers for USDC pool: ${usdcRouters}`);
};
