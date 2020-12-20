<template>
  <div>
    <p>{{ proposition.title }}</p>
    <p>{{ proposition.description }}</p>
    <p>
      Proposed by <span>{{ proposition.proposedBy }}</span>
    </p>
    <div>Status: {{ this.propositionStatusText }}</div>
    <div>
      Start: <span>{{ proposition.startBlock }}</span> End:
      <span>{{ proposition.endBlock }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return { propositionStatus: 0, propositionStatusText: "Pending" };
  },
  props: {
    proposition: Object,
  },
  methods: {
    showPropositionText(statusId) {
      switch (statusId) {
        case "0":
          this.propositionStatusText = "Pending";
          break;
        case "1":
          this.propositionStatusText = "Active";
          break;
        case "2":
          this.propositionStatusText = "Succeeded";
          break;
        case "3":
          this.propositionStatusText = "Failed";
          break;
        default:
          break;
      }
    },
    async getPropositionStatus() {
      const contract = this.$store.state.CommunityVotingContract;
      const status = await contract.methods
        .getPropositionStatus(this.proposition.id - 1)
        .call();
      this.propositionStatus = status;

      // display proposition status as text
      this.showPropositionText(status);
    },
  },
  async created() {
    await this.getPropositionStatus();
  },
};
</script>

<style scoped>
</style>
