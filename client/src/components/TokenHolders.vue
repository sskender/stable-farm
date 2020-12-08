<template>
  <div class="wrap-token-holders">
    <h3>Members</h3>
    <p>Active members: {{ this.tokenHoldersList.length }}</p>
    <ul>
      <li v-for="holder in tokenHoldersList" :key="holder">
        {{ holder }}
      </li>
    </ul>
  </div>
</template>

<script>
import DaoTokenContract from "./../providers/DaoTokenContract";

export default {
  data: () => {
    return { tokenHoldersList: [] };
  },
  methods: {
    async getTokenHolders() {
      const holders = await DaoTokenContract.methods.tokenHolders().call();
      this.tokenHoldersList = holders;
    },
  },
  async created() {
    await this.getTokenHolders();
  },
};
</script>

<style scoped>
</style>

