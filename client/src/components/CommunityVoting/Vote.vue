<template>
  <div class="wrap-proposition-vote">
    <button v-on:click="voteApprove">APPROVE</button>
    <button v-on:click="voteDeny">DENY</button>
    <button v-on:click="voteReserved">RESERVED</button>
  </div>
</template>

<script>
export default {
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
      console.log(propositionId, votingOption);
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.CommunityVotingContract;

      try {
        const transation = await contract.methods
          .vote(propositionId, votingOption)
          .send({ from: caller });
        console.log(transation);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
</style>
