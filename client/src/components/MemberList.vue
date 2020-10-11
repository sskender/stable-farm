<template>
  <div class="member-list">
    <h2>Active members:</h2>
    <div v-bind:key="member.address" v-for="member in members">
      <MemberItem v-bind:member="member" />
    </div>
  </div>
</template>

<script>
import MemberItem from "./MemberItem.vue";

export default {
  components: {
    MemberItem,
  },
  props: {
    members: Array,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.member-list {
  border-style: solid;
  border-width: 10px;
  border-color: gray;
}
</style>
