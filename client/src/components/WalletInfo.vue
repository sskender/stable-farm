<template>
  <div class="wrap-wallet-info">
    <div v-if="walletAddress">
      Hello, <span>{{ walletAddress }}</span>
    </div>
    <div v-else>Please connect wallet</div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      walletAddress: "0x61d62800f58BE96883136b8d915a8E866d8a059b",
      balance: 0,
    };
  },
};
</script>>

<style scoped>
</style>>
