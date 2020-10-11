<template>
  <div class="user-info">
    <p>{{myAddress}} : {{myBalance}}</p>
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
  border-width: 10px;
  border-color: red;
}
</style>
