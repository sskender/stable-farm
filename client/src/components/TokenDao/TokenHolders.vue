<template>
  <div class="wrap-token-holders">
    <h3>Active members</h3>
    <p>
      Chairman: <br />
      <span class="account-address">{{ this.chairmanAddress }}</span>
    </p>
    <p>
      Total members: <span>{{ numberOfTokenHolders() }}</span>
    </p>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item"
        v-for="holder in tokenHolders()"
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
    return { chairmanAddress: null };
  },
  methods: {
    async getChairman() {
      const contract = this.$store.state.DaoTokenContract;
      const chairman = await contract.methods.chairman().call();
      this.chairmanAddress = chairman;
    },
    numberOfTokenHolders() {
      return this.$store.getters.numberOfTokenHolders;
    },
    tokenHolders() {
      return this.$store.state.tokenHoldersList;
    },
  },
  async created() {
    await this.getChairman();
  },
};
</script>

<style scoped>
</style>

