const Borrow = artifacts.require("Borrow");
const Vault = artifacts.require("Vault");

module.exports = async (deployer) => {
  await deployer.deploy(Borrow);
  await deployer.deploy(Vault);
};
