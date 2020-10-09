<template>
  <div class="enrollment">
    <h4>{{enrollmentTitle}}</h4>
    <p>false</p>
  </div>
</template>

<script>
export default {
  name: "Enrollment",
  props: {
    enrollmentTitle: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
