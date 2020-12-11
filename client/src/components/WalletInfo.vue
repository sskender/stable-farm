<template>
  <div class="wrap-wallet-info">
    <div v-if="accountAddress">
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
import DaoTokenJson from "./../providers/abi/DaoToken.json";

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

      // store account address to vuex
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      this.accountAddress = account;
      this.$store.commit("saveAccountAddress", this.accountAddress);

      // load balance
      const contract = this.$store.state.DaoTokenContract;
      const balance = await contract.methods.balanceOf(account).call();
      this.accountBalance = balance;
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
  created() {
    this.accountAddress = this.$store.state.accountAddress;
  },
};
</script>>

<style scoped>
</style>>
