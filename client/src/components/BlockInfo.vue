<template>
  <div class="wrap-block-info">
    Current block: <span>{{ this.blockNumber }}</span> <br />
    <b-icon-arrow-clockwise
      animation="spin"
      font-scale="1"
    ></b-icon-arrow-clockwise>
    Updated <span>{{ this.lastUpdateInSeconds }}</span> s ago.
  </div>
</template>

<script>
export default {
  name: "BlockInfo",
  data: () => {
    return { blockNumber: null, updatedAt: null, lastUpdateInSeconds: 0 };
  },
  methods: {
    async updateBlockNumber() {
      const block = await this.$store.state.web3.eth.getBlockNumber();
      this.blockNumber = block;
      this.updatedAt = new Date();
    },
    async getTimeDifference() {
      const timeDiff = new Date() - this.updatedAt;
      this.lastUpdateInSeconds = Math.round(timeDiff / 1000);
    },
  },
  async created() {
    await this.updateBlockNumber();

    // update block number
    this.intervalUpdate = setInterval(
      async () => await this.updateBlockNumber(),
      10000
    );

    // update last updated time difference
    this.intervalCalculate = setInterval(
      async () => await this.getTimeDifference(),
      1000
    );
  },
};
</script>

<style scoped>
</style>

