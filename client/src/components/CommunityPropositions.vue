<template>
  <div class="wrap-community-propositions">
    <PropositionsList />
  </div>
</template>

<script>
import PropositionsList from "./CommunityVoting/PropositionsList.vue";

export default {
  name: "CommunityPropositions",
  components: {
    PropositionsList,
  },
};
</script>

<style scoped>
.wrap-community-propositions {
  padding-top: 2%;
}
</style>
