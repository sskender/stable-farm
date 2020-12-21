import Vue from "vue";
import Vuex from "vuex";

import web3 from "../providers/web3";
import DaoTokenJson from "../providers/abi/DaoToken.json";
import CommunityVotingJson from "../providers/abi/CommunityVoting.json";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    web3: null,
    DaoTokenContract: null,
    CommunityVotingContract: null,
    accountAddress: null,
    member: false,
    chairmanConnected: false,
    blockNumber: 0,
    tokenHoldersList: [],
    propositionsList: [],
  },
  getters: {
    numberOfTokenHolders: (state) => {
      return state.tokenHoldersList.length;
    },
    propositions: (state) => {
      return state.propositionsList;
    },
    numberOfPropositions: (state) => {
      return state.propositionsList.length;
    },
  },
  mutations: {
    loadAccountData: async (state) => {
      const accounts = await state.web3.eth.getAccounts();
      state.accountAddress = accounts[0];

      const contract = state.DaoTokenContract;

      // check if account is a member
      const balance = await contract.methods
        .balanceOf(state.accountAddress)
        .call();
      state.member = balance > 0;

      // check if account is a chairman
      const chairmanAddress = await contract.methods.chairman().call();
      state.chairmanConnected = state.accountAddress == chairmanAddress;
    },
    loadBlockNumber: async (state) => {
      const block = await state.web3.eth.getBlockNumber();
      state.blockNumber = block;
    },
    loadMembers: async (state) => {
      const contract = state.DaoTokenContract;
      const members = await contract.methods.tokenHolders().call();

      // shuffle for fun
      var arrayCopy = members.slice(0);
      const sorter = arrayCopy.sort(function() {
        return Math.random() - 0.5;
      });

      state.tokenHoldersList = sorter;
    },
    loadPropositionsList: async (state) => {
      const contract = state.CommunityVotingContract;
      const propositionsNumber = await contract.methods
        .getNumberOfPropositions()
        .call();

      // load only newer propositions
      const currentLen = state.propositionsList.length;
      for (let i = propositionsNumber - 1; i >= currentLen; i--) {
        const prop = await contract.methods.getPropositionInfo(i).call();
        state.propositionsList.push(prop);
      }
    },
    prepareWeb3: (state, web3) => {
      // store new web3
      state.web3 = web3;

      // load dao token contract
      const tokenAddress = "0xebc303f547DB6c9f18355E247871f3563E1E86d4";
      const DaoTokenContract = new state.web3.eth.Contract(
        DaoTokenJson.abi,
        tokenAddress
      );

      // load community voting contract
      const communityAddress = "0x153BcF2593E3e2645A443BC2739a0b504932c9b4";
      const CommunityVotingContract = new state.web3.eth.Contract(
        CommunityVotingJson.abi,
        communityAddress
      );

      // store contract references
      state.DaoTokenContract = DaoTokenContract;
      state.CommunityVotingContract = CommunityVotingContract;
    },
  },
  actions: {
    updateApplicationData(context) {
      context.commit("loadBlockNumber");
      context.commit("loadMembers");
      context.commit("loadPropositionsList");
    },
  },
});

store.commit("prepareWeb3", web3);

export default store;
