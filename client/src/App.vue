<template>
  <div id="app">
    <div class="container-fluid">
      <div class="row wrap-info-header">
        <div class="col-md-4 text-left">
          <BlockInfo />
        </div>
        <div class="col-md-8 text-right">
          <ConnectWallet />
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <ContractsInfo />
        </div>
        <div class="col-md-4">
          <MembersCenter />
        </div>
        <div class="col-md-4">
          <CommunityPropositions />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConnectWallet from "./components/ConnectWallet.vue";
import BlockInfo from "./components/BlockInfo.vue";
import ContractsInfo from "./components/ContractsInfo.vue";
import MembersCenter from "./components/MembersCenter.vue";
import CommunityPropositions from "./components/CommunityPropositions.vue";

export default {
  name: "App",
  components: {
    ConnectWallet,
    BlockInfo,
    ContractsInfo,
    MembersCenter,
    CommunityPropositions,
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
