<template>
  <div class="wrap-wallet-info">
    <div v-if="this.$store.state.accountAddress">
      Hello, <span>{{ this.$store.state.accountAddress }}</span> <br />
      <span>You are {{ this.$store.state.member ? "" : "not" }} a member!</span>
    </div>
    <div v-else>
      <span>Please connect wallet</span><br />
      <button v-on:click="connectWallet">Connect</button>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import DaoTokenJson from "./../providers/abi/DaoToken.json";

export default {
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

      // store account data to vuex
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      this.accountAddress = account;
      this.$store.commit("saveAccountAddress", this.accountAddress);
    },
    async prepareContracts() {
      const web3 = window.web3;

      // prepare dao token contract
      const tokenAddress = "0xebc303f547DB6c9f18355E247871f3563E1E86d4";
      const DaoTokenContract = new web3.eth.Contract(
        DaoTokenJson.abi,
        tokenAddress
      );

      // store dao token contract to vuex
      this.$store.state.DaoTokenContract = DaoTokenContract;
    },
    async connectWallet() {
      await this.loadWeb3();
      await this.prepareContracts();
      await this.loadAccountData();
    },
  },
};
</script>

<style scoped></style>
