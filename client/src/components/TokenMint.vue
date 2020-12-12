<template>
  <div class="wrap-token-mint">
    <p v-if="mintingEnabled">We are accepting new members!</p>
    <p v-else>We are not accepting new members at the moment</p>

    <div
      v-if="
        mintingEnabled &&
        !this.$store.state.member &&
        this.$store.state.accountAddress
      "
    >
      <span>Claim your membership token here</span>
      <button v-on:click="mintToken">JOIN</button>
    </div>

    <div v-if="this.$store.state.chairmanConnected">
      <span>Minting new tokens</span>
      <button v-if="mintingEnabled" v-on:click="disableMinting">DISABLE</button>
      <button v-else v-on:click="enableMinting">ENABLE</button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      mintingEnabled: false,
    };
  },
  methods: {
    async getMintingStatus() {
      const contract = this.$store.state.DaoTokenContract;
      const minting = await contract.methods.isMintable().call();
      this.mintingEnabled = minting;
    },
    async enableMinting() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.enableMinting().send({ from: caller });
        this.mintingEnabled = true;
      } catch (err) {
        // TODO
      }
    },
    async disableMinting() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.disableMinting().send({ from: caller });
        this.mintingEnabled = false;
      } catch (err) {
        // TODO
      }
    },
    async mintToken() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.mint().send({ from: caller });
      } catch (err) {
        // TODO
      }
    },
  },
  async created() {
    await this.getMintingStatus();
  },
};
</script>

<style scoped>
</style>

