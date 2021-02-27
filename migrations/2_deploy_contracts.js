const Vault = artifacts.require("Vault");

module.exports = async (deployer) => {
  await deployer.deploy(Vault);
};
