<template>
  <div class="wrap-proposition-item">
    <div class="card border-dark bg-light mb-2" style="max-width: 30rem">
      <div class="card-body text-dark">
        <h5 class="card-title">{{ proposition.title }}</h5>
        <p class="card-text">
          <i>{{ proposition.description }}</i>
        </p>
        <div class="card-text">
          <small>
            <div class="text-left">
              Proposed by<br />
              <span class="account-address">{{ proposition.proposedBy }}</span>
            </div>
            <div class="wrap-votes-stat text-right">
              Votes:
              <span id="accept">{{ this.votes.accept }}</span> /
              <span id="deny">{{ this.votes.deny }}</span> /
              <span id="reserved">{{ this.votes.reserved }}</span>
            </div>
          </small>
        </div>
      </div>
      <div class="card-footer text-center">
        <div v-if="isVotable(proposition)">
          <Vote :propositionId="Number(proposition.id)" />
        </div>
        <div v-else>
          <span
            class="prop-status-text"
            v-bind:class="{
              'text-danger': propositionStatus == 3,
              'text-success': propositionStatus == 2,
              'text-primary': propositionStatus == 1,
              'text-secondary': propositionStatus == 0,
            }"
            >{{ propositionStatusText }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vote from "./Vote.vue";

export default {
  data: () => {
    return {
      propositionStatus: 0,
      propositionStatusText: "",
      votes: { total: 0, accept: 0, deny: 0, reserved: 0 },
    };
  },
  props: {
    proposition: Object,
  },
  components: {
    Vote,
  },
  methods: {
    isVotable(proposition) {
      const blockNumber = this.$store.state.blockNumber;
      return (
        this.$store.state.member &&
        proposition.startBlock <= blockNumber &&
        proposition.endBlock >= blockNumber
      );
    },
    async getPropositionStatusText() {
      let statusText;
      switch (this.propositionStatus) {
        case "0":
          statusText = "Pending";
          break;
        case "1":
          statusText = "Active";
          break;
        case "2":
          statusText = "Succeeded";
          break;
        case "3":
          statusText = "Failed";
          break;
        default:
          statusText = "Pending";
          break;
      }
      this.propositionStatusText = statusText.toUpperCase();
    },
    async getPropositionStatus() {
      const contract = this.$store.state.CommunityVotingContract;
      try {
        const status = await contract.methods
          .getPropositionStatus(this.proposition.id - 1)
          .call();
        this.propositionStatus = status;
      } catch (err) {
        console.error(err);
      }
    },
    async getPropositionVotes() {
      const contract = this.$store.state.CommunityVotingContract;
      try {
        const votes = await contract.methods
          .getPropositionVotes(this.proposition.id - 1)
          .call();
        this.votes.total = votes.totalVotes;
        this.votes.accept = votes.totalVotesAccept;
        this.votes.deny = votes.totalVotesDeny;
        this.votes.reserved = votes.totalVotesReserved;
      } catch (err) {
        console.error(err);
      }
    },
  },
  async created() {
    await this.getPropositionStatus();
    await this.getPropositionStatusText();
    await this.getPropositionVotes();
  },
};
</script>

<style scoped>
span.prop-status-text {
  font-weight: bold;
}

.wrap-votes-stat {
  margin-top: -1.25rem;
}

span#accept {
  color: green;
}

span#deny {
  color: red;
}

span#reserved {
  color: orange;
}
</style>
