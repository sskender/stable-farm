<template>
  <div>
    <h4>All propositions</h4>
    <div v-for="proposition in propositionsList" :key="proposition.id">
      <PropositionItem :proposition="proposition" />
    </div>
  </div>
</template>

<script>
import PropositionItem from "./PropositionItem.vue";

export default {
  data: () => {
    return { propositionsList: [] };
  },
  methods: {
    async loadPropositionsList() {
      const contract = this.$store.state.CommunityVotingContract;

      const totalPropositions = await contract.methods
        .getNumberOfPropositions()
        .call();

      this.totalPropositions = [];
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
