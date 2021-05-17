<template>
  <div>
    <div class="pool">
      <PoolInterface v-bind:poolJson="this.daiPoolJson" /><br />
    </div>
    <div class="pool">
      <PoolInterface v-bind:poolJson="this.usdcPoolJson" /><br />
    </div>
  </div>
</template>

<script>
import DAIPoolJson from "../../build/contracts/DAIPool.json";
import USDCPoolJson from "../../build/contracts/USDCPool.json";

import PoolInterface from "./PoolInterface.vue";

export default {
  name: "PoolsList",
  data: () => {
    return { daiPoolJson: DAIPoolJson, usdcPoolJson: USDCPoolJson };
  },
  components: {
    PoolInterface,
  },
};
</script>

<style scoped>
div.pool {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
