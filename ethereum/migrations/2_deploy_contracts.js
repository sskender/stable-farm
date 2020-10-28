const DaoToken = artifacts.require("DaoToken");
const CommunityVoting = artifacts.require("CommunityVoting");

module.exports = async (deployer) => {
  // DaoToken
  await deployer.deploy(DaoToken);

  // CommunityVoting
  await deployer.deploy(CommunityVoting, DaoToken.address);
};
