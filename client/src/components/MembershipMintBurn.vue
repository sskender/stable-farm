<template>
  <div class="membership-mint-burn">
    <div>
      <div v-if="myBalance == 0">MINT token</div>
      <div v-else>BURN token</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    myBalance: Number,
    isMintable: Boolean,
    checkIsMintable: Function,
  },
  methods: {
    mint() {
      this.myBalance++;
    },
    burn() {
      if (this.myBalance > 0) {
        this.myBalance--;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.membership-mint-burn {
  border-style: solid;
  border-width: 5px;
  border-color: cyan;
}
</style>
