<template>
  <div class="wrap-wallet-info">
    <div v-if="this.$store.state.accountAddress">
      Hello,
      <span class="account-address">{{
        this.$store.state.accountAddress
      }}</span>
      <br />
      <p>You are {{ this.$store.state.member ? "" : "not" }} a member!</p>
    </div>
    <div v-else>
      Please connect wallet
      <button v-on:click="connectWallet">Connect</button>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  name: "ConnectWallet",
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
    async connectWallet() {
      // load web3 and wallet
      await this.loadWeb3();

      // save web3 to vuex and reload contracts
      this.$store.commit("prepareWeb3", window.web3);

      // save account data to vuex
      this.$store.commit("loadAccountData");
    },
  },
};
</script>

<style scoped></style>
