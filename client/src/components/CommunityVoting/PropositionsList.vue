<template>
  <div>
    <h4>
      Community propositions (<span>{{ numberOfPropositions }}</span
      >)
    </h4>
    <div v-for="proposition in propositionsList" :key="proposition.id">
      <PropositionItem :proposition="proposition" />
    </div>
  </div>
</template>

<script>
import PropositionItem from "./PropositionItem.vue";

export default {
  data: () => {
    return { propositionsList: [], numberOfPropositions: 0 };
  },
  components: {
    PropositionItem,
  },
  methods: {
    getPropositions() {
      this.propositionsList = this.$store.getters.propositions;
    },
    getNumberOfPropositions() {
      this.numberOfPropositions = this.$store.getters.numberOfPropositions;
    },
  },
  created() {
    this.getNumberOfPropositions();
    this.getPropositions();
  },
};
</script>

<style scoped>
</style>
