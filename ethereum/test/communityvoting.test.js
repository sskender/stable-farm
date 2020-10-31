const CommunityVoting = artifacts.require('CommunityVoting');

contract('CommunityVoting test', async (accounts) => {
  it('it should set default token values', async () => {
    const instance = await CommunityVoting.deployed();
    const name = await instance.getName();
    const propositions = await instance.getNumberOfPropositions();
    const tokenAddress = await instance.getTokenAddress();
    assert.equal(name, 'EESTEC LC Zagreb Basic Voting Contract');
    assert.equal(propositions.valueOf(), 0);
    assert.equal(web3.utils.isAddress(tokenAddress), true);
  });
});
