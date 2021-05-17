<template>
  <div id="wallet">
    <div v-if="!connected">
      <button id="btn-connect" v-on:click="connectWallet">Connect</button>
    </div>
    <div id="connected-user" v-else>
      Account
      <span>
        {{ this.account }}
      </span>
    </div>
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

<style scoped>
div#wallet {
  margin-top: 10px;
  margin-right: 10px;
  display: flex;
  justify-content: flex-end;
}

div#connected-user {
  font-size: 16px;
  color: #fafafa;
}

button#btn-connect {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 10px;
  background-color: #7ff5bc;
  border-color: #fafafa;
  border-style: solid;
  border-width: 2px;
}
</style>

