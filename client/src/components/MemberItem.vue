<template>
  <div class="member-item">
    <p>=> {{member.address}}</p>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.member-item {
  border-style: solid;
  border-width: 5px;
  border-color: orange;
}
</style>
