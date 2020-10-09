<template>
  <div class="members">
    <h2>Members:</h2>
    <div v-bind:key="member.address" v-for="member in members">
      <Member v-bind:member="member" />
    </div>
  </div>
</template>

<script>
import Member from "./Member.vue";

export default {
  name: "Members",
  components: {
    Member,
  },
  props: ["members"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
