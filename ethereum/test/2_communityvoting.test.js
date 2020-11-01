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

  it('it should set default token contract address', async () => {
    const instance = await CommunityVoting.deployed();
    const tokenInstance = await DaoToken.deployed();
    const tokenAddress = await instance.getTokenAddress();
    assert.equal(web3.utils.isAddress(tokenAddress), true);
    assert.equal(tokenInstance.address, tokenAddress);
  });

  it('it should fail to create a proposition with invalid start block #1', async () => {
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

  it('it should fail to create a proposition with invalid start block #2', async () => {
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

  it('it should fail to create a proposition with invalid end block #1', async () => {
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

  it('it should fail to create a proposition with invalid end block #2', async () => {
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

  it('it should fail to create a proposition with invalid end block #3', async () => {
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

  it('it should fail to create a proposition from non member', async () => {
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

  it('it should fail to fetch a non-existing proposition', async () => {
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

  it('it should create a new proposition from contract deployer', async () => {
    const deployer = accounts[0];
    const instance = await CommunityVoting.deployed();
    const blockNumber = await web3.eth.getBlockNumber();
    await instance.createProposition(
      'Prop title',
      'Prop desc',
      blockNumber + 3,
      blockNumber + 20
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

  it('it should fail to vote on a pending proposition', async () => {
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

  it('it should fetch proposition 0 votes', async () => {
    const instance = await CommunityVoting.deployed();
    const votes = await instance.getPropositionVotes(0);
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
      blockNumber + 25
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

  it('it should allow members to create a proposition', async () => {
    const member = accounts[1];
    const blockNumber = await web3.eth.getBlockNumber();
    const tokenInstance = await DaoToken.deployed();
    await tokenInstance.enableMinting();
    await tokenInstance.mint({from: accounts[1]});
    const instance = await CommunityVoting.deployed();
    await instance.createProposition(
      'Prop title member',
      'Prop desc member',
      blockNumber + 5,
      blockNumber + 28,
      {from: member}
    );
    const totalPropositions = await instance.getNumberOfPropositions();
    const propositionInfo = await instance.getPropositionInfo(2);
    assert.equal(totalPropositions.valueOf(), 3);
    assert.equal(propositionInfo.title, 'Prop title member');
    assert.equal(propositionInfo.description, 'Prop desc member');
    assert.equal(propositionInfo.proposedBy, member);
  });

  it('it should fetch propositions status info', async () => {
    const instance = await CommunityVoting.deployed();
    const propositionStatus1 = await instance.getPropositionStatus(0);
    const propositionStatus2 = await instance.getPropositionStatus(1);
    const propositionStatus3 = await instance.getPropositionStatus(2);
    assert.equal(propositionStatus1.valueOf(), 1);
    assert.equal(propositionStatus2.valueOf(), 1);
    assert.equal(propositionStatus3.valueOf(), 0);
  });

  it('it should vote FOR on the first proposition', async () => {
    const instance = await CommunityVoting.deployed();
    await instance.vote(0, 0);
    const votes = await instance.getPropositionVotes(0);
    assert.equal(votes.totalVotes, 1);
    assert.equal(votes.totalVotesAccept, 1);
    assert.equal(votes.totalVotesDeny, 0);
    assert.equal(votes.totalVotesReserved, 0);
  });

  it('it should fail to vote again', async () => {
    const instance = await CommunityVoting.deployed();
    let e = null;
    try {
      await instance.vote(0, 0);
    } catch (err) {
      e = err.reason;
    }
    const votes = await instance.getPropositionVotes(0);
    assert.equal(e, 'You already voted');
    assert.equal(votes.totalVotes, 1);
    assert.equal(votes.totalVotesAccept, 1);
    assert.equal(votes.totalVotesDeny, 0);
    assert.equal(votes.totalVotesReserved, 0);
  });

  it('it should fail for a non member to vote', async () => {
    const nonMember = accounts[2];
    const instance = await CommunityVoting.deployed();
    let e = null;
    try {
      await instance.vote(0, 0, {from: nonMember});
    } catch (err) {
      e = err.reason;
    }
    const votes = await instance.getPropositionVotes(0);
    assert.equal(e, 'You are not an active member');
    assert.equal(votes.totalVotes, 1);
    assert.equal(votes.totalVotesAccept, 1);
    assert.equal(votes.totalVotesDeny, 0);
    assert.equal(votes.totalVotesReserved, 0);
  });

  it('it should be voted by quorum to accept the first proposition', async () => {
    const tokenInstance = await DaoToken.deployed();
    await tokenInstance.mint({from: accounts[2]});
    await tokenInstance.mint({from: accounts[3]});
    await tokenInstance.mint({from: accounts[4]});
    await tokenInstance.mint({from: accounts[5]});
    await tokenInstance.mint({from: accounts[6]});
    const instance = await CommunityVoting.deployed();
    await instance.vote(0, 1, {from: accounts[1]});
    await instance.vote(0, 0, {from: accounts[2]});
    await instance.vote(0, 0, {from: accounts[3]});
    await instance.vote(0, 2, {from: accounts[4]});
    const votes = await instance.getPropositionVotes(0);
    assert.equal(votes.totalVotes, 5);
    assert.equal(votes.totalVotesAccept, 3);
    assert.equal(votes.totalVotesDeny, 1);
    assert.equal(votes.totalVotesReserved, 1);
  });

  it('it should be voted by quorum to deny the second proposition', async () => {
    const instance = await CommunityVoting.deployed();
    await instance.vote(1, 1);
    await instance.vote(1, 1, {from: accounts[1]});
    await instance.vote(1, 1, {from: accounts[2]});
    await instance.vote(1, 1, {from: accounts[3]});
    await instance.vote(1, 0, {from: accounts[4]});
    const votes = await instance.getPropositionVotes(1);
    assert.equal(votes.totalVotes, 5);
    assert.equal(votes.totalVotesAccept, 1);
    assert.equal(votes.totalVotesDeny, 4);
    assert.equal(votes.totalVotesReserved, 0);
  });

  it('it should fail to gather voting quorum on the third proposition', async () => {
    const tokenInstance = await DaoToken.deployed();
    await tokenInstance.mint({from: accounts[7]});
    await tokenInstance.mint({from: accounts[8]});
    await tokenInstance.mint({from: accounts[9]});
    await tokenInstance.disableMinting();
    const instance = await CommunityVoting.deployed();
    await instance.vote(2, 1);
    await instance.vote(2, 1, {from: accounts[1]});
    await instance.vote(2, 1, {from: accounts[2]});
    await instance.vote(2, 1, {from: accounts[3]});
    const votes = await instance.getPropositionVotes(2);
    assert.equal(votes.totalVotes, 4);
    assert.equal(votes.totalVotesAccept, 0);
    assert.equal(votes.totalVotesDeny, 4);
    assert.equal(votes.totalVotesReserved, 0);
  });

  it('it should fail to vote on a closed proposition', async () => {
    const instance = await CommunityVoting.deployed();
    let e = null;
    try {
      await instance.vote(1, 2);
    } catch (err) {
      e = err.reason;
    }
    const votes = await instance.getPropositionVotes(1);
    assert.equal(e, 'Proposition is not active for voting');
    assert.equal(votes.totalVotes, 5);
    assert.equal(votes.totalVotesAccept, 1);
    assert.equal(votes.totalVotesDeny, 4);
    assert.equal(votes.totalVotesReserved, 0);
  });

  it('it should fetch the first proposition succeeded status info', async () => {
    const instance = await CommunityVoting.deployed();
    const propositionStatus = await instance.getPropositionStatus(0);
    assert.equal(propositionStatus.valueOf(), 2);
  });

  it('it should fetch the second proposition failed status info', async () => {
    const instance = await CommunityVoting.deployed();
    const propositionStatus = await instance.getPropositionStatus(1);
    assert.equal(propositionStatus.valueOf(), 3);
  });

  it('it should fetch the third proposition failed status info - no quorum', async () => {
    const instance = await CommunityVoting.deployed();
    const propositionStatus = await instance.getPropositionStatus(2);
    assert.equal(propositionStatus.valueOf(), 3);
  });
});
