import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    accountAddress: null,
    chairmanConnected: false,
  },
  mutations: {
    saveAccountAddress: (state, accountAddress) => {
      state.accountAddress = accountAddress;
    },
    verifyChairmanConnected: (state, chairmanConnected) => {
      state.chairmanConnected = chairmanConnected;
    },
  },
});

export default store;
