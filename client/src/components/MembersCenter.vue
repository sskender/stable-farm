<template>
  <div class="wrap-members-center">
    <TokenMint />
    <CreateBasicProposition />
  </div>
</template>

<script>
import TokenMint from "./TokenDao/TokenMint.vue";
import CreateBasicProposition from "./CommunityVoting/CreateBasicProposition.vue";

export default {
  name: "MembersCenter",
  components: {
    TokenMint,
    CreateBasicProposition,
  },
};
</script>

<style scoped>
.wrap-members-center {
  padding-top: 2%;
}
</style>
