import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    DaoTokenContract: null,
    accountAddress: null,
    member: false,
    chairmanConnected: false,
  },
  mutations: {
    saveAccountAddress: (state, accountAddress) => {
      state.accountAddress = accountAddress;

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
  },
});

export default store;
