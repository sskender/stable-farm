<template>
  <div>
    <h4>
      All propositions (<span>{{ getNumberOfPropositions() }}</span
      >)
    </h4>
    <div v-for="proposition in getPropositions()" :key="proposition.id">
      <PropositionItem :proposition="proposition" />
    </div>
  </div>
</template>

<script>
import PropositionItem from "./PropositionItem.vue";

export default {
  data: () => {
    return {};
  },
  components: {
    PropositionItem,
  },
  methods: {
    getPropositions() {
      return this.$store.getters.propositions;
    },
    getNumberOfPropositions() {
      return this.$store.getters.numberOfPropositions;
    },
  },
  created() {},
};
</script>

<style scoped>
</style>
