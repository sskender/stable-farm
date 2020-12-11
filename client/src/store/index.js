import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    accountAddress: null,
  },
  mutations: {
    saveAccountAddress: (state, accountAddress) => {
      state.accountAddress = accountAddress;
    },
  },
});

export default store;
