<template>
  <div class="wrap-community-voting">
    <h3>Community Voting Panel</h3>
    <div>
      <p>{{ this.communityVotingContractName }}</p>
      <span class="account-address">{{
        this.communityVotingContractAddress
      }}</span>
    </div>
    <button @click="toggleShowCreateBasicProposition">
      Make a new proposition
    </button>
    <div v-if="showCreateBasicProposition">
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
    return {
      communityVotingContractName: null,
      communityVotingContractAddress: null,
      showCreateBasicProposition: false,
    };
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
    async getContractAddress() {
      const contract = this.$store.state.CommunityVotingContract;
      const address = await contract.options.address;
      this.communityVotingContractAddress = address;
    },
    toggleShowCreateBasicProposition() {
      this.showCreateBasicProposition = !this.showCreateBasicProposition;
    },
  },
  async created() {
    await this.getContractName();
    await this.getContractAddress();
  },
};
</script>

<style scoped>
</style>
