<template>
  <div class="user-info">
    <p>My address: {{myAddress}}</p>
    <p>My balance: {{myBalance}}</p>
  </div>
</template>

<script charset="utf-8">
export default {
  props: { myAddress: String, myBalance: Number },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-info {
  border-style: solid;
  border-width: 5px;
  border-color: red;
}
</style>
