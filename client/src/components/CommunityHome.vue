<template>
  <div class="wrap-community-voting-home">
    <PropositionsList />
  </div>
</template>

<script>
import PropositionsList from "./CommunityVoting/PropositionsList.vue";

export default {
  name: "CommunityHome",
  components: {
    PropositionsList,
  },
};
</script>

<style scoped>
.wrap-community-voting-home {
  padding-top: 2rem;
}
</style>
