<template>
  <div class="wrap-community-voting">
    <h3>Community Voting Panel</h3>
    <div>
      <p>{{ this.communityVotingContractName }}</p>
    </div>
    <div>
      <CreateBasicProposition />
    </div>
    <div>
      <PropositionsList />
    </div>
  </div>
</template>

<script>
import CreateBasicProposition from "./CreateBasicProposition";
import PropositionsList from "./PropositionsList";

export default {
  name: "CommunityVoting",
  data: () => {
    return { communityVotingContractName: null };
  },
  components: {
    CreateBasicProposition,
    PropositionsList,
  },
  methods: {
    async getContractName() {
      const contract = this.$store.state.CommunityVotingContract;
      const name = await contract.methods.getName().call();
      this.communityVotingContractName = name;
    },
  },
  async created() {
    await this.getContractName();
  },
};
</script>

<style scoped>
</style>
