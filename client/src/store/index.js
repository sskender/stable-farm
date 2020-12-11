import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    DaoTokenContract: null,
    accountAddress: null,
    chairmanConnected: false,
  },
  mutations: {
    saveAccountAddress: (state, accountAddress) => {
      state.accountAddress = accountAddress;

      const contract = state.DaoTokenContract;
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
