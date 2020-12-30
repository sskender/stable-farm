<template>
  <div class="wrap-proposition-vote">
    <button
      type="button"
      class="btn btn-outline-success btn-sm col-4"
      v-on:click="voteApprove"
    >
      APPROVE
    </button>
    <button
      type="button"
      class="btn btn-outline-danger btn-sm col-4"
      v-on:click="voteDeny"
    >
      DENY
    </button>
    <button
      type="button"
      class="btn btn-outline-warning btn-sm col-4"
      v-on:click="voteReserved"
    >
      RESERVED
    </button>
  </div>
</template>

<script>
export default {
  name: "Vote",
  data: () => {
    return {};
  },
  props: {
    propositionId: Number,
  },
  methods: {
    async voteApprove() {
      const id = this.propositionId - 1;
      const votingOption = 0;
      await this.vote(id, votingOption);
    },
    async voteDeny() {
      const id = this.propositionId - 1;
      const votingOption = 1;
      await this.vote(id, votingOption);
    },
    async voteReserved() {
      const id = this.propositionId - 1;
      const votingOption = 2;
      await this.vote(id, votingOption);
    },
    async vote(propositionId, votingOption) {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.CommunityVotingContract;

      try {
        const transation = await contract.methods
          .vote(propositionId, votingOption)
          .send({ from: caller });
        console.log(transation);
      } catch (err) {
        console.error(err);
        window.alert("Unable to vote");
      }
    },
  },
};
</script>

<style scoped>
</style>
