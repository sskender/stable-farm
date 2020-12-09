<template>
  <div class="wrap-token-holders">
    <h3>Active members</h3>
    <p>
      Chairman: <br />
      <span id="chairman-address">{{ this.chairmanAddress }}</span>
    </p>
    <p>
      Active members: <span>{{ this.tokenHoldersList.length }}</span>
    </p>
    <ul>
      <li v-for="holder in tokenHoldersList" :key="holder">
        <span id="holder-address"> {{ holder }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
import DaoTokenContract from "./../providers/DaoTokenContract";

export default {
  data: () => {
    return { tokenHoldersList: [], chairmanAddress: null };
  },
  methods: {
    async getChairman() {
      const chairman = await DaoTokenContract.methods.chairman().call();
      this.chairmanAddress = chairman;
    },
    async getTokenHolders() {
      const holders = await DaoTokenContract.methods.tokenHolders().call();
      this.tokenHoldersList = holders;
    },
  },
  async created() {
    await this.getChairman();
    await this.getTokenHolders();
  },
};
</script>

<style scoped>
</style>

