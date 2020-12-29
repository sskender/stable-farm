<template>
  <div class="container">
    <div class="row text-center">
      <div class="col-12">
        <div v-if="mintingEnabled()">
          <h5>WE ARE ACCEPTING NEW MEMBERS!</h5>
          <TokenMintMembers />
        </div>
        <div v-else>
          <h5>SORRY, WE ARE NOT ACCEPTING NEW MEMBERS AT THE MOMENT</h5>
        </div>
        <div v-if="this.$store.state.chairmanConnected">
          <TokenMintAdmin />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TokenMintMembers from "./TokenDao/TokenMintMembers.vue";
import TokenMintAdmin from "./TokenDao/TokenMintAdmin.vue";

export default {
  name: "TokenMint",
  methods: {
    mintingEnabled() {
      return this.$store.state.mintingEnabled;
    },
  },
  components: {
    TokenMintMembers,
    TokenMintAdmin,
  },
};
</script>

<style scoped>
</style>
