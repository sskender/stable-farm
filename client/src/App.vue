<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row wrap-info-header">
        <div class="col-md-6 text-left">
          <BlockInfo />
        </div>
        <div class="col-md-6 text-right">
          <ConnectWallet />
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <TokenMint />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <ContractsInfo />
        </div>
        <div class="col-md-6">
          <CommunityHome />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConnectWallet from "./components/ConnectWallet.vue";
import BlockInfo from "./components/BlockInfo.vue";
import TokenMint from "./components/TokenMint.vue";
import ContractsInfo from "./components/ContractsInfo.vue";
import CommunityHome from "./components/CommunityHome.vue";

export default {
  name: "App",
  components: {
    ConnectWallet,
    BlockInfo,
    TokenMint,
    ContractsInfo,
    CommunityHome,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.wrap-info-header {
  font-size: 18px;
}
</style>
