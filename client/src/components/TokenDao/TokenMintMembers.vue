<template>
  <div class="wrap-token-mint-join">
    <button
      v-if="this.$store.state.accountAddress && !this.$store.state.member"
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
    async mintToken() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.mint().send({ from: caller });
      } catch (err) {
        console.error(err);
        this.$store.commit("createAlert", "Unable to mint token!");
      }
    },
  },
};
</script>

<style scoped>
</style>

