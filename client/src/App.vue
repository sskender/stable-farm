<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4 text-left">
          <BlockInfo />
        </div>
        <div class="col-md-8 text-right">
          <ConnectWallet />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <TokenDao />
        </div>
        <div class="col-md-6">
          <CommunityVoting />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConnectWallet from "./components/ConnectWallet.vue";
import BlockInfo from "./components/BlockInfo.vue";
import TokenDao from "./components/TokenDao/TokenDao.vue";
import CommunityVoting from "./components/CommunityVoting/CommunityVoting.vue";

export default {
  name: "App",
  components: {
    ConnectWallet,
    BlockInfo,
    TokenDao,
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
