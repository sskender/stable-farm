<template>
  <div class="token-info">
    <p>{{tokenName}} ({{tokenSymbol}})</p>
    <p>
      Total supply:
      <span>{{tokenSupply}}</span>
    </p>
  </div>
</template>

<script charset="utf-8">
export default {
  props: { tokenName: String, tokenSymbol: String, tokenSupply: Number },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.token-info {
  border-style: solid;
  border-width: 5px;
  border-color: green;
}
</style>
