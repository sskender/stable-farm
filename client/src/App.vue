<template>
  <div id="app">
    <InfoPanel :myAddress="myAddress" :myBalance="myBalance" />
    <Membership :myBalance="myBalance" />
    <MemberList :members="members" />
  </div>
</template>

<script>
import web3 from "./providers/web3";

import InfoPanel from "./components/InfoPanel.vue";
import Membership from "./components/Membership.vue";
import MemberList from "./components/MemberList.vue";

export default {
  name: "App",
  components: {
    InfoPanel,
    Membership,
    MemberList,
  },
  data() {
    return {
      members: [],
      myAddress: "0x",
      myBalance: 2,
    };
  },
  methods: {
    async getMembers() {
      this.members = [];
      const accounts = await web3.eth.getAccounts();
      accounts.forEach((a) => {
        this.members.push({ address: a });
      });
    },
    getUserAddress() {
      this.myAddress = "0x61d62800f58BE96883136b8d915a8E866d8a059b";
    },
  },
  async created() {
    // this runs on load
    await this.getMembers();
    this.getUserAddress();
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
