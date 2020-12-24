<template>
  <div class="wrap-propositions-list">
    <h4>
      Community propositions
      <span class="badge badge-pill badge-danger badge-red">{{
        getNumberOfPropositions()
      }}</span>
    </h4>
    <div v-if="this.$store.state.member">
      <CreateBasicProposition />
    </div>
    <div v-for="proposition in propositionsList" :key="proposition.id">
      <PropositionItem :proposition="proposition" />
    </div>
  </div>
</template>

<script>
import CreateBasicProposition from "./CreateBasicProposition.vue";
import PropositionItem from "./PropositionItem.vue";

export default {
  name: "PropositionsList",
  data: () => {
    return { propositionsList: [] };
  },
  components: {
    CreateBasicProposition,
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

.badge-red {
  background-color: #e50400;
}
</style>
