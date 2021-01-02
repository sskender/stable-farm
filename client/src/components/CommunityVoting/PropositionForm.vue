<template>
  <div class="wrap-proposition-form">
    <form @submit.prevent="createProposition">
      <div class="form-row">
        <div class="form-group col-12">
          <input
            class="form-control"
            type="text"
            v-model="propositionTitle"
            placeholder="Proposition title"
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-12">
          <textarea
            class="form-control"
            rows="3"
            cols="30"
            type="text"
            v-model="propositionDescription"
            placeholder="Please type your proposition description in here"
          ></textarea>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <input
            class="form-control"
            type="number"
            v-model="startBlock"
            placeholder="Start block"
          />
        </div>
        <div class="form-group col-md-6">
          <input
            class="form-control"
            type="number"
            v-model="endBlock"
            placeholder="End block"
          />
        </div>
      </div>
      <div v-if="startBlock && endBlock">
        <p>
          Estimated proposition duration is
          <span>{{ estimateDuration() }}</span> hours
        </p>
      </div>
      <div class="form-group text-center submit-proposition-button">
        <button class="btn btn-color" type="submit">Submit proposition</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "PropositionForm",
  data: () => {
    return {
      propositionTitle: null,
      propositionDescription: null,
      startBlock: null,
      endBlock: null,
    };
  },
  methods: {
    estimateDuration() {
      if (
        this.startBlock &&
        this.endBlock &&
        this.endBlock - this.startBlock > 0
      ) {
        const calc =
          (Math.round(this.endBlock - this.startBlock) * 15) / 60 / 60;
        return calc.toFixed(1);
      } else {
        return 0;
      }
    },
    async createProposition() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.CommunityVotingContract;

      // pick up proposition data
      const title = this.propositionTitle;
      const desc = this.propositionDescription;
      const start = Number(this.startBlock);
      const end = Number(this.endBlock);

      try {
        // wallet method call
        await contract.methods
          .createProposition(title, desc, start, end)
          .send({ from: caller });

        // clean form data
        this.propositionTitle = null;
        this.propositionDescription = null;
        this.startBlock = null;
        this.endBlock = null;
      } catch (err) {
        console.error(err);
        this.$store.commit("createAlert", "Failed to create a proposition!");
      }

      this.$emit("close-modal");
    },
  },
};
</script>

<style scoped>
.wrap-proposition-form {
  padding-top: 0px;
}

.submit-proposition-button {
  padding-top: 1.5rem;
}
</style>
