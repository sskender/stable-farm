<template>
  <div>
    <h4>All propositions</h4>
    <div>
      Total propositions: <span>{{ this.totalPropositions }}</span>
    </div>
    <div v-for="proposition in propositionsList" :key="proposition.id">
      <PropositionItem :proposition="proposition" />
    </div>
  </div>
</template>

<script>
import PropositionItem from "./PropositionItem.vue";

export default {
  data: () => {
    return { totalPropositions: 0, propositionsList: [] };
  },
  methods: {
    async loadPropositionsList() {
      const contract = this.$store.state.CommunityVotingContract;

      // get total number of propositions
      const totalPropositions = await contract.methods
        .getNumberOfPropositions()
        .call();
      this.totalPropositions = totalPropositions;

      // load all propositions
      for (let i = 0; i < totalPropositions; i++) {
        const proposition = await contract.methods.getPropositionInfo(i).call();
        this.propositionsList.push(proposition);
      }
    },
  },
  components: {
    PropositionItem,
  },
  async created() {
    this.loadPropositionsList();
  },
};
</script>

<style scoped>
</style>
