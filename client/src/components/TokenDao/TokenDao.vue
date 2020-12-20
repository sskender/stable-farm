<template>
  <div class="wrap-token-dao">
    <TokenInfo />
    <TokenMint />
    <TokenHolders />
  </div>
</template>

<script>
import TokenInfo from "./TokenInfo.vue";
import TokenHolders from "./TokenHolders.vue";
import TokenMint from "./TokenMint.vue";

export default {
  name: "TokenDao",
  components: {
    TokenInfo,
    TokenHolders,
    TokenMint,
  },
};
</script>
