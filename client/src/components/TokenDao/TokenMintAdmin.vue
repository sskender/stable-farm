<template>
  <div class="wrap-token-minting">
    <button
      class="btn btn-color"
      v-if="mintingEnabled()"
      v-on:click="disableMinting"
    >
      Disable minting
    </button>
    <button class="btn btn-primary" v-else v-on:click="enableMinting">
      Enable minting
    </button>
  </div>
</template>

<script>
export default {
  name: "TokenMintAdmin",
  methods: {
    mintingEnabled() {
      return this.$store.state.mintingEnabled;
    },
    async enableMinting() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.enableMinting().send({ from: caller });
      } catch (err) {
        console.error(err);
        window.alert("Unable to mint");
      }
    },
    async disableMinting() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.disableMinting().send({ from: caller });
      } catch (err) {
        console.error(err);
        window.alert("Unable to mint");
      }
    },
  },
};
</script>

<style scoped>
</style>

