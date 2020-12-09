<template>
  <div class="dao-home">
    <div class="wrap-token">
      <TokenInfo />
      <TokenHolders />
    </div>
    <div class="wrap-vote"></div>
  </div>
</template>

<script>
import TokenInfo from "./../components/TokenInfo.vue";
import TokenHolders from "./../components/TokenHolders.vue";

export default {
  name: "DaoHome",
  components: {
    TokenInfo,
    TokenHolders,
  },
};
</script>

<style scoped>
</style>
