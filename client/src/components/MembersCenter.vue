<template>
  <div class="wrap-members-center">
    <div class="row">
      <div class="col-md-6">
        <TokenMint />
        <CreateBasicProposition />
      </div>
      <div class="col-md-6">
        <PropositionsList />
      </div>
    </div>
  </div>
</template>

<script>
import TokenMint from "./TokenDao/TokenMint.vue";
import CreateBasicProposition from "./CommunityVoting/CreateBasicProposition.vue";
import PropositionsList from "./CommunityVoting/PropositionsList.vue";

export default {
  name: "MembersCenter",
  components: {
    TokenMint,
    CreateBasicProposition,
    PropositionsList,
  },
};
</script>

<style scoped>
.wrap-members-center {
  padding-top: 2%;
}
</style>
