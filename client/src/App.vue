<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          <DaoHome />
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
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
