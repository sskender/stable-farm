const BasicVote = artifacts.require("BasicVote");

module.exports = function(deployer) {
  deployer.deploy(BasicVote);
};
