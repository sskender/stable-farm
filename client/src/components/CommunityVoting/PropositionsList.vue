<template>
  <div class="wrap-propositions-list">
    <h4>
      Community propositions (<span>{{ getNumberOfPropositions() }}</span
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
  name: "PropositionsList",
  data: () => {
    return { propositionsList: [] };
  },
  components: {
    PropositionItem,
  },
  methods: {
    getPropositions() {
      this.propositionsList = this.$store.getters.propositions;
    },
    getNumberOfPropositions() {
      return this.$store.getters.numberOfPropositions;
    },
  },
  created() {
    this.getPropositions();
  },
};
</script>

<style scoped>
h4 {
  padding-bottom: 2rem;
}
</style>
