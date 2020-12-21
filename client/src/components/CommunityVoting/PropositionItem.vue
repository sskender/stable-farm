<template>
  <div class="wrap-proposition-item">
    <div class="card border-dark bg-light mb-3" style="max-width: 28rem">
      <div class="card-header bg-light text-dark">
        <b>{{ proposition.title }}</b>
      </div>
      <div class="card-body text-dark">
        <p class="card-text">
          <i>{{ proposition.description }}</i>
        </p>
        <p class="card-text">
          <small>
            Proposed by
            <span class="account-address">{{ proposition.proposedBy }}</span>
          </small>
        </p>
      </div>
      <div class="card-footer bg-light">
        <Vote :propositionId="Number(proposition.id)" />
        Status: <span>{{ this.propositionStatusText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vote from "./Vote.vue";

export default {
  data: () => {
    return { propositionStatus: 0, propositionStatusText: "Pending" };
  },
  props: {
    proposition: Object,
  },
  components: {
    Vote,
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
