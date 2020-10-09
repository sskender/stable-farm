<template>
  <div class="member">
    <p>=> {{member.address}}</p>
  </div>
</template>

<script>
export default {
  name: "Member",
  props: ["member"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
