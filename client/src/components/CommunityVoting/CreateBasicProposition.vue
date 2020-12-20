<template>
  <div>
    <h4>Make a community proposition</h4>
    <form @submit.prevent="createProposition">
      <input type="text" v-model="propositionTitle" placeholder="Title" />
      <br />
      <input
        type="text"
        v-model="propositionDescription"
        placeholder="Proposition text"
      /><br />
      <input
        type="number"
        v-model="startBlock"
        placeholder="Starting block number"
      />
      <input
        type="number"
        v-model="endBlock"
        placeholder="Ending block number"
      />
      <br />
      <button type="submit">Propose</button>
    </form>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      propositionTitle: null,
      propositionDescription: null,
      startBlock: null,
      endBlock: null,
    };
  },
  methods: {
    async createProposition() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.CommunityVotingContract;

      // proposition data
      const title = this.propositionTitle;
      const desc = this.propositionDescription;
      const start = Number(this.startBlock);
      const end = Number(this.endBlock);

      try {
        // wallet call
        const transation = await contract.methods
          .createProposition(title, desc, start, end)
          .send({ from: caller });

        console.log(transation);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
</style>
