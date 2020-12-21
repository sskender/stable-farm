<template>
  <div class="wrap-block-info">
    <b-icon-arrow-clockwise
      animation="spin"
      font-scale="1"
    ></b-icon-arrow-clockwise>
    Updated <span>{{ this.lastUpdateInSeconds }}</span> seconds ago. Block
    number is
    <span>{{ this.$store.state.blockNumber }}</span>
  </div>
</template>

<script>
export default {
  name: "BlockInfo",
  data: () => {
    return {
      updatedAt: null,
      lastUpdateInSeconds: 0,
      intervalUpdateApp: null,
      intervalCalculateLastUpdate: null,
    };
  },
  methods: {
    logUpdateTime() {
      this.updatedAt = new Date();
    },
    getTimeDifference() {
      const timeDiff = new Date() - this.updatedAt;
      this.lastUpdateInSeconds = Math.round(timeDiff / 1000);
    },
  },
  created() {
    // pull blockchain data when ready
    this.logUpdateTime();
    this.$store.dispatch("updateApplicationData");

    // update application data
    this.intervalUpdateApp = setInterval(() => {
      this.logUpdateTime();
      this.$store.dispatch("updateApplicationData");
    }, 10000);

    // update last updated time difference
    this.intervalCalculateLastUpdate = setInterval(() => {
      this.getTimeDifference();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalUpdateApp);
    clearInterval(this.intervalCalculateLastUpdate);
  },
};
</script>

<style scoped>
</style>

