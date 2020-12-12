import Vue from "vue";
import Vuex from "vuex";

import web3 from "../providers/web3";
import DaoTokenJson from "../providers/abi/DaoToken.json";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    web3: null,
    DaoTokenContract: null,
    accountAddress: null,
    member: false,
    chairmanConnected: false,
  },
  mutations: {
    saveAccountData: async (state) => {
      const accounts = await state.web3.eth.getAccounts();
      state.accountAddress = accounts[0];

      const contract = state.DaoTokenContract;

      // check if account is a member
      contract.methods
        .balanceOf(state.accountAddress)
        .call()
        .then((b) => {
          state.member = b > 0;
        });

      // check if account is chairman
      contract.methods
        .chairman()
        .call()
        .then((c) => {
          state.chairmanConnected = state.accountAddress == c;
        });
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

      // store contract reference
      state.DaoTokenContract = DaoTokenContract;
    },
  },
});

store.commit("prepareWeb3", web3);

export default store;
