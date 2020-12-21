<template>
  <div class="wrap-proposition-item">
    <div class="card border-dark bg-light mb-2" style="max-width: 28rem">
      <div class="card-body text-dark">
        <h5 class="card-title">{{ proposition.title }}</h5>
        <p class="card-text">
          <i>{{ proposition.description }}</i>
          <br />
          <small class="card-text text-right">
            Proposed by
            <span class="account-address">{{ proposition.proposedBy }}</span>
          </small>
        </p>
      </div>
      <div class="card-footer text-center">
        <div v-if="isVotable(proposition)">
          <Vote :propositionId="Number(proposition.id)" />
        </div>
        <div v-else>
          <span
            v-bind:class="{
              'text-danger': propositionStatus == 3,
              'text-success': propositionStatus == 2,
              'text-primary': propositionStatus == 1,
              'text-secondary': propositionStatus == 0,
            }"
            >{{ propositionStatusText }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vote from "./Vote.vue";

export default {
  data: () => {
    return { propositionStatus: 0, propositionStatusText: "" };
  },
  props: {
    proposition: Object,
  },
  components: {
    Vote,
  },
  methods: {
    isVotable(proposition) {
      const blockNumber = this.$store.state.blockNumber;
      return (
        this.$store.state.member &&
        proposition.startBlock <= blockNumber &&
        proposition.endBlock >= blockNumber
      );
    },
    async getPropositionStatusText() {
      let statusText;
      switch (this.propositionStatus) {
        case "0":
          statusText = "Pending";
          break;
        case "1":
          statusText = "Active";
          break;
        case "2":
          statusText = "Succeeded";
          break;
        case "3":
          statusText = "Failed";
          break;
        default:
          break;
      }
      this.propositionStatusText = statusText.toUpperCase();
    },
    async getPropositionStatus() {
      const contract = this.$store.state.CommunityVotingContract;
      const status = await contract.methods
        .getPropositionStatus(this.proposition.id - 1)
        .call();
      this.propositionStatus = status;
    },
  },
  async created() {
    await this.getPropositionStatus();
    await this.getPropositionStatusText();
  },
};
</script>

<style scoped>
</style>
