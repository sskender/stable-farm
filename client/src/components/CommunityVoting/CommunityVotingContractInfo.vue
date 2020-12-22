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
      try {
        const name = await contract.methods.getName().call();
        this.communityVotingContractName = name;
      } catch (err) {
        console.error(err);
      }
    },
    async getContractAddress() {
      const contract = this.$store.state.CommunityVotingContract;
      try {
        const address = await contract.options.address;
        this.communityVotingContractAddress = address;
      } catch (err) {
        console.error(err);
      }
    },
  },
  async created() {
    await this.getContractName();
    await this.getContractAddress();
  },
};
</script>

<style scoped>
.wrap-community-contract-info {
  padding-top: 3%;
}
</style>
