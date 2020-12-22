<template>
  <div class="wrap-community-contract-info">
    <p>{{ this.communityVotingContractName }}</p>
    Address:
    <span class="account-address">{{
      this.communityVotingContractAddress
    }}</span>
  </div>
</template>

<script>
export default {
  name: "CommunityVotingContractInfo",
  data: () => {
    return {
      communityVotingContractName: null,
      communityVotingContractAddress: null,
    };
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
  },
  async created() {
    await this.getContractName();
    await this.getContractAddress();
  },
};
</script>

<style scoped>
</style>
