<template>
  <div class="wrap-contracts-info">
    <TokenDaoContractInfo />
    <CommunityVotingContractInfo />
    <TokenHolders />
  </div>
</template>

<script>
import TokenDaoContractInfo from "./TokenDao/TokenDaoContractInfo";
import CommunityVotingContractInfo from "./CommunityVoting/CommunityVotingContractInfo.vue";
import TokenHolders from "./TokenDao/TokenHolders.vue";

export default {
  name: "ContractsInfo",
  components: {
    TokenDaoContractInfo,
    CommunityVotingContractInfo,
    TokenHolders,
  },
};
</script>

<style scoped>
</style>
