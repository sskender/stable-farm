<template>
  <div class="dao-home">
    <div class="wrap-token">
      <BlockInfo />
      <TokenInfo />
      <TokenHolders />
    </div>
    <div class="wrap-vote"></div>
  </div>
</template>

<script>
import BlockInfo from "./../components/BlockInfo.vue";
import TokenInfo from "./../components/TokenInfo.vue";
import TokenHolders from "./../components/TokenHolders.vue";

export default {
  name: "DaoHome",
  components: {
    BlockInfo,
    TokenInfo,
    TokenHolders,
  },
};
</script>

<style scoped>
</style>
