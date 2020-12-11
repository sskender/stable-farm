<template>
  <div class="wrap-token-mint">
    <div v-if="mintingEnabled">
      <p>
        We are accepting new members!<br />
        <span>Claim your membership token here</span>
      </p>
      <button v-on:click="mintToken">JOIN</button>
    </div>
    <div v-else>We are not accepting new members at the moment</div>
    <div v-if="this.$store.state.chairmanConnected">
      <span>Minting new tokens</span>
      <button v-if="mintingEnabled" v-on:click="disableMinting">DISABLE</button>
      <button v-else v-on:click="enableMinting">ENABLE</button>
    </div>
  </div>
</template>

<script>
import DaoTokenContract from "./../providers/DaoTokenContract";

export default {
  data: () => {
    return {
      mintingEnabled: false,
    };
  },
  methods: {
    async getMintingStatus() {
      const minting = await DaoTokenContract.methods.isMintable().call();
      this.mintingEnabled = minting;
    },
    async enableMinting() {
      console.log("enabling minting");
      this.mintingEnabled = true;
    },
    async disableMinting() {
      console.log("disabling minting");
      this.mintingEnabled = false;
    },
    async mintToken() {
      console.log("minting started");
    },
  },
  async created() {
    await this.getMintingStatus();
  },
};
</script>

<style scoped>
</style>

