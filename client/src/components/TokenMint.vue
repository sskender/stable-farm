<template>
  <div class="container">
    <div class="row text-center">
      <div class="col-12">
        <TokenMintMembers />
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
  components: {
    TokenMintMembers,
    TokenMintAdmin,
  },
};
</script>

<style scoped>
</style>
