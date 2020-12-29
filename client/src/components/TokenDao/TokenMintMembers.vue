<template>
  <div class="wrap-token-mint-join">
    <h4 v-if="mintingEnabled()">We are accepting new members!</h4>
    <h4 v-else>We are not accepting new members at the moment</h4>
    <button
      v-if="
        mintingEnabled() &&
        this.$store.state.accountAddress &&
        !this.$store.state.member
      "
      class="btn btn-color"
      v-on:click="mintToken"
    >
      JOIN NOW
    </button>
  </div>
</template>

<script>
export default {
  name: "TokenMintMembers",
  methods: {
    mintingEnabled() {
      return this.$store.state.mintingEnabled;
    },
    async mintToken() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.mint().send({ from: caller });
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

