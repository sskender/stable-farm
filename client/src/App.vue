<template>
  <div id="app">
    <DaoHome />
  </div>
</template>

<script>
import DaoHome from "./components/DaoHome";

export default {
  name: "App",
  components: {
    DaoHome,
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
