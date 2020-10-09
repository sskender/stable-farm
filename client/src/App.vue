<template>
  <div id="app">
    <Enrollment enrollmentTitle="Mintable" />
    <Members v-bind:members="members" />
  </div>
</template>

<script>
import Enrollment from "./components/Enrollment.vue";
import Members from "./components/MembersList.vue";

export default {
  name: "App",
  components: {
    Enrollment,
    Members,
  },
  data() {
    return {
      members: [{ address: "0x1" }, { address: "0x2" }, { address: "0x3" }],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
