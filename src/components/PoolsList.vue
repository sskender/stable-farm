<template>
  <div>
    <PoolInterface v-bind:poolJson="this.daiPoolJson" /><br />
    <PoolInterface v-bind:poolJson="this.usdcPoolJson" /><br />
  </div>
</template>

<script>
import DAIMixedPoolJson from "../../build/contracts/DAIMixedPool.json";
import USDCMixedPoolJson from "../../build/contracts/USDCMixedPool.json";

import PoolInterface from "./PoolInterface.vue";

export default {
  name: "PoolsList",
  data: () => {
    return { daiPoolJson: DAIMixedPoolJson, usdcPoolJson: USDCMixedPoolJson };
  },
  components: {
    PoolInterface,
  },
};
</script>

<style scoped></style>
