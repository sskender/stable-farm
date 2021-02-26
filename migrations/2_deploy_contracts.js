const BankAccount = artifacts.require("BankAccount");

module.exports = async (deployer) => {
  await deployer.deploy(BankAccount);
};
