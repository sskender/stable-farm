<template>
  <div class="wrap-token-holders">
    <h3>Active members</h3>
    <p>
      Chairman: <br />
      <span class="account-address">{{ this.chairmanAddress }}</span>
    </p>
    <p>
      Total members: <span>{{ this.tokenHoldersList.length }}</span>
    </p>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item"
        v-for="holder in tokenHoldersList"
        :key="holder"
      >
        <span class="account-address"> {{ holder }} </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => {
    return { tokenHoldersList: [], chairmanAddress: null };
  },
  methods: {
    async getChairman() {
      const contract = this.$store.state.DaoTokenContract;
      const chairman = await contract.methods.chairman().call();
      this.chairmanAddress = chairman;
    },
    async getTokenHolders() {
      const contract = this.$store.state.DaoTokenContract;
      const holders = await contract.methods.tokenHolders().call();
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

