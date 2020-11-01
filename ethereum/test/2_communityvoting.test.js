/* eslint-disable no-undef */
const DaoToken = artifacts.require('DaoToken');
const CommunityVoting = artifacts.require('CommunityVoting');

contract('CommunityVoting test', async (accounts) => {
  it('it should set default contract values', async () => {
    const instance = await CommunityVoting.deployed();
    const name = await instance.getName();
    const propositions = await instance.getNumberOfPropositions();
    assert.equal(name, 'EESTEC LC Zagreb Basic Voting Contract');
    assert.equal(propositions.valueOf(), 0);
  });

  it('it should set default token values', async () => {
    const instance = await CommunityVoting.deployed();
    const tokenInstance = await DaoToken.deployed();
    const tokenAddress = await instance.getTokenAddress();
    assert.equal(web3.utils.isAddress(tokenAddress), true);
    assert.equal(tokenInstance.address, tokenAddress);
  });

  it('it should prevent proposition with invalid start block 1', async () => {
    const instance = await CommunityVoting.deployed();
    const blockNumber = await web3.eth.getBlockNumber();
    let propositionId = null;
    let e = null;
    try {
      propositionId = await instance.createProposition(
        'Prop title',
        'Prop desc',
        blockNumber - 1,
        blockNumber + 15
      );
    } catch (err) {
      e = err.reason;
    }
    assert.equal(e, 'Invalid start block number');
    assert.equal(propositionId, null);
  });

  it('it should prevent proposition with invalid start block 2', async () => {
    const instance = await CommunityVoting.deployed();
    const blockNumber = await web3.eth.getBlockNumber();
    let propositionId = null;
    let e = null;
    try {
      propositionId = await instance.createProposition(
        'Prop title',
        'Prop desc',
        blockNumber,
        blockNumber + 15
      );
    } catch (err) {
      e = err.reason;
    }
    assert.equal(e, 'Invalid start block number');
    assert.equal(propositionId, null);
  });

  it('it should prevent proposition with invalid end block 1', async () => {
    const instance = await CommunityVoting.deployed();
    const blockNumber = await web3.eth.getBlockNumber();
    let propositionId = null;
    let e = null;
    try {
      propositionId = await instance.createProposition(
        'Prop title',
        'Prop desc',
        blockNumber + 1,
        blockNumber
      );
    } catch (err) {
      e = err.reason;
    }
    assert.equal(e, 'Invalid end block number');
    assert.equal(propositionId, null);
  });

  it('it should prevent proposition with invalid end block 2', async () => {
    const instance = await CommunityVoting.deployed();
    const blockNumber = await web3.eth.getBlockNumber();
    let propositionId = null;
    let e = null;
    try {
      propositionId = await instance.createProposition(
        'Prop title',
        'Prop desc',
        blockNumber + 1,
        blockNumber + 1
      );
    } catch (err) {
      e = err.reason;
    }
    assert.equal(e, 'Invalid end block number');
    assert.equal(propositionId, null);
  });

  it('it should prevent proposition with invalid end block 3', async () => {
    const instance = await CommunityVoting.deployed();
    const blockNumber = await web3.eth.getBlockNumber();
    let propositionId = null;
    let e = null;
    try {
      propositionId = await instance.createProposition(
        'Prop title',
        'Prop desc',
        blockNumber + 1,
        blockNumber + 10
      );
    } catch (err) {
      e = err.reason;
    }
    assert.equal(e, 'Invalid end block number');
    assert.equal(propositionId, null);
  });

  it('it should fail to create proposition from non member', async () => {
    const nonMember = accounts[5];
    const blockNumber = await web3.eth.getBlockNumber();
    const instance = await CommunityVoting.deployed();
    const totalPropositions = await instance.getNumberOfPropositions();
    let e = null;
    try {
      await instance.createProposition(
        'Prop title',
        'Prop desc',
        blockNumber + 2,
        blockNumber + 11,
        {from: nonMember}
      );
    } catch (err) {
      e = err.reason;
    }
    assert.equal(e, 'You are not an active member');
    assert.equal(totalPropositions.valueOf(), 0);
  });

  it('it should fail to fetch non-existing proposition', async () => {
    const instance = await CommunityVoting.deployed();
    const totalPropositions = await instance.getNumberOfPropositions();
    let e = null;
    try {
      await instance.getPropositionInfo(0);
    } catch (err) {
      e = JSON.stringify(err);
    }
    assert.equal(e.includes('Invalid proposition Id'), true);
    assert.equal(totalPropositions.valueOf(), 0);
  });

  it('it should create a new proposition from deployer', async () => {
    const deployer = accounts[0];
    const instance = await CommunityVoting.deployed();
    const blockNumber = await web3.eth.getBlockNumber();
    await instance.createProposition(
      'Prop title',
      'Prop desc',
      blockNumber + 3,
      blockNumber + 11
    );
    const totalPropositions = await instance.getNumberOfPropositions();
    const propositionInfo = await instance.getPropositionInfo(0);

    assert.equal(totalPropositions.valueOf(), 1);
    assert.equal(propositionInfo.title, 'Prop title');
    assert.equal(propositionInfo.description, 'Prop desc');
    assert.equal(propositionInfo.proposedBy, deployer);
  });

  it('it should fetch proposition pending status info', async () => {
    const instance = await CommunityVoting.deployed();
    const propositionStatus = await instance.getPropositionStatus(0);
    assert.equal(propositionStatus.valueOf(), 0);
  });

  it('it should fetch proposition votes', async () => {
    const instance = await CommunityVoting.deployed();
    const votes = await instance.getPropositionVotes(0);
    assert.equal(votes.totalVotes, 0);
    assert.equal(votes.totalVotesAccept, 0);
    assert.equal(votes.totalVotesDeny, 0);
    assert.equal(votes.totalVotesReserved, 0);
  });

  it('it should fail to vote on pending proposition', async () => {
    const instance = await CommunityVoting.deployed();
    let e = null;
    try {
      await instance.vote(0, 0);
    } catch (err) {
      e = err.reason;
    }
    const votes = await instance.getPropositionVotes(0);
    assert.equal(e, 'Proposition is not active for voting');
    assert.equal(votes.totalVotes, 0);
    assert.equal(votes.totalVotesAccept, 0);
    assert.equal(votes.totalVotesDeny, 0);
    assert.equal(votes.totalVotesReserved, 0);
  });

  it('it should create another proposition from deployer', async () => {
    const deployer = accounts[0];
    const instance = await CommunityVoting.deployed();
    const blockNumber = await web3.eth.getBlockNumber();
    await instance.createProposition(
      'Prop title 2',
      'Prop desc 2',
      blockNumber + 2,
      blockNumber + 11
    );
    const totalPropositions = await instance.getNumberOfPropositions();
    const oldPropositionInfo = await instance.getPropositionInfo(0);
    const propositionInfo = await instance.getPropositionInfo(1);

    assert.equal(totalPropositions.valueOf(), 2);
    assert.equal(oldPropositionInfo.title, 'Prop title');
    assert.equal(oldPropositionInfo.description, 'Prop desc');
    assert.equal(oldPropositionInfo.proposedBy, deployer);
    assert.equal(propositionInfo.title, 'Prop title 2');
    assert.equal(propositionInfo.description, 'Prop desc 2');
    assert.equal(propositionInfo.proposedBy, deployer);
  });

  it('it should fetch proposition active status info', async () => {
    const instance = await CommunityVoting.deployed();
    const propositionStatus = await instance.getPropositionStatus(0);
    assert.equal(propositionStatus.valueOf(), 1);
  });
});
