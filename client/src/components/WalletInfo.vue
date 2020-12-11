<template>
  <div class="wrap-wallet-info">
    <div v-if="account">
      Hello, <span>{{ accountAddress }}</span> <br />
      <span>You are {{ accountBalance > 0 ? "" : "not" }} a member!</span>
    </div>
    <div v-else>
      <span>Please connect wallet</span><br />
      <button v-on:click="connectWallet">Connect</button>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import DaoTokenContract from "./../providers/DaoTokenContract";

export default {
  data: () => {
    return {
      accountAddress: null,
      accountBalance: 0,
    };
  },
  methods: {
    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else {
        window.alert(
          "Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!"
        );
      }
    },
    async loadAccountData() {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const balance = await DaoTokenContract.methods
        .balanceOf(this.account)
        .call();

      this.accountAddress = accounts[0];
      this.accountBalance = balance;

      // store account to vuex
      this.$store.commit("saveAccountAddress", this.accountAddress);
    },
    async connectWallet() {
      await this.loadWeb3();
      await this.loadAccountData();
    },
  },
};
</script>>

<style scoped>
</style>>
