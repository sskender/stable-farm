<template>
  <div class="dao-home">
    <div class="wrap-token">
      <BlockInfo />
      <ConnectWallet />
      <TokenInfo />
      <TokenMint />
      <TokenHolders />
    </div>
    <div class="wrap-vote"></div>
  </div>
</template>

<script>
import BlockInfo from "./../components/BlockInfo.vue";
import TokenInfo from "./../components/TokenInfo.vue";
import TokenHolders from "./../components/TokenHolders.vue";
import TokenMint from "./../components/TokenMint.vue";
import ConnectWallet from "./../components/ConnectWallet.vue";

export default {
  name: "DaoHome",
  components: {
    BlockInfo,
    TokenHolders,
    TokenInfo,
    TokenMint,
    ConnectWallet,
  },
};
</script>

<style scoped>
</style>
