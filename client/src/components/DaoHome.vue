<template>
  <div class="dao-home">
    <div class="wrap-token">
      <TokenHolders />
    </div>
  </div>
</template>

<script>
import TokenHolders from "./../components/TokenHolders.vue";

export default {
  name: "DaoHome",
  components: {
    TokenHolders,
  },
};
</script>

<style scoped>
</style>
