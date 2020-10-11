<template>
  <div id="app">
    <InfoPanel />
    <Enrollment enrollmentTitle="Mintable" />
    <Members v-bind:members="members" />
  </div>
</template>

<script>
import web3 from "./providers/web3";
import Enrollment from "./components/Enrollment.vue";
import Members from "./components/MembersList.vue";
import InfoPanel from "./components/InfoPanel.vue";

export default {
  name: "App",
  components: {
    Enrollment,
    Members,
    InfoPanel,
  },
  data() {
    return {
      members: [],
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
  },
  async created() {
    // this runs on load
    await this.getMembers();
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
