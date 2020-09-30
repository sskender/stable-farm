const Token = artifacts.require("ERC777Token");

module.exports = function (deployer) {
  deployer.deploy(Token);
};
