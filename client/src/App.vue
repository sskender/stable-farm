<template>
  <div id="app">
    <DaoHome />
    <CommunityVoting />
  </div>
</template>

<script>
// TODO extract wallet stuff here
import DaoHome from "./components/DaoHome";
import CommunityVoting from "./components/CommunityVoting/CommunityVoting";

export default {
  name: "App",
  components: {
    DaoHome,
    CommunityVoting,
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
