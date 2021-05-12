<template>
  <div>
    <div v-if="!connected">
      <button v-on:click="connectWallet">Connect</button>
    </div>
    <div v-else>Hello, {{ this.account }}</div>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  name: "ConnectWallet",
  data: () => {
    return {
      connected: false,
      account: null,
    };
  },
  methods: {
    async connectWallet() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts);
      const account = accounts[0];
      this.account = account;
      this.connected = true;
      window.web3 = new Web3(window.ethereum);
      window.account = account;
    },
  },
  async created() {
    // TODO change the default provider (without metamask)
    const provider = new Web3.providers.HttpProvider("http://localhost:8545");
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );
    window.web3 = web3;
    window.provider = provider;
  },
};
</script>
