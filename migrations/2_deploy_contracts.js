const MainnetAddresses = require("./../test/mainnet.addresses");

const CompoundRouter = artifacts.require("CompoundRouter");

const DAIMixedPool = artifacts.require("DAIMixedPool");
const USDCMixedPool = artifacts.require("USDCMixedPool");

module.exports = async (deployer) => {
  // DAI Compund Router
  const daiCompoundRouter = await CompoundRouter.new(
    MainnetAddresses.COMPTROLLER_ADDRESS,
    MainnetAddresses.DAI_ADDRESS,
    MainnetAddresses.CDAI_ADDRESS,
    MainnetAddresses.UNISWAP_ROUTER_02
  );

  console.log(`Deployed DAI Compound Router: ${daiCompoundRouter.address}`);

  // USDC Compound Router
  const usdcCompoundRouter = await CompoundRouter.new(
    MainnetAddresses.COMPTROLLER_ADDRESS,
    MainnetAddresses.USDC_ADDRESS,
    MainnetAddresses.CUSDC_ADDRESS,
    MainnetAddresses.UNISWAP_ROUTER_02
  );

  console.log(`Deployed USDC Compound Router: ${usdcCompoundRouter.address}`);

  // DAI Mixed Pool
  const DAIPool = await deployer.deploy(DAIMixedPool);

  await DAIPool.addRouter(daiCompoundRouter.address);
  await DAIPool.addRouter(usdcCompoundRouter.address);

  const daiRouters = await DAIPool.getRouters();
  console.log(daiRouters);

  // USDC Mixed Pool
  const USDCPool = await deployer.deploy(USDCMixedPool);

  await USDCPool.addRouter(daiCompoundRouter.address);
  await USDCPool.addRouter(usdcCompoundRouter.address);

  const usdcRouters = await DAIPool.getRouters();
  console.log(usdcRouters);
};

