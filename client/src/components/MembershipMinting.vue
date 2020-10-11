<template>
  <div class="membership-minting">
    <div>
      <div v-if="isMintable">DISABLE MINTING</div>
      <div v-else>ENABLE MINTING</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isMintable: Boolean,
    checkIsMintable: Function,
  },
  methods: {
    disableMinting() {
      this.isMintable = false;
    },
    enableMinting() {
      this.isMintable = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.membership-minting {
  border-style: solid;
  border-width: 5px;
  border-color: yellow;
}
</style>
