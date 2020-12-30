<template>
  <div class="wrap-proposition-item">
    <div
      class="card border-dark bg-light mb-2 card-custom"
      style="max-width: 35rem"
    >
      <div class="card-body text-dark card-body-custom">
        <h5 class="card-title">{{ proposition.title }}</h5>
        <p class="card-text">
          <i>{{ proposition.description }}</i>
        </p>
        <div class="card-text">
          <div class="text-left">
            <small>
              Proposed by:<br />
              <ul>
                <li>
                  <span class="account-address">{{
                    proposition.proposedBy
                  }}</span>
                </li>
              </ul>
            </small>
          </div>
          <div class="text-left">
            <small
              >Block start:
              <span class="account-address">{{ proposition.startBlock }}</span>
              <br />
              Block finish:
              <span class="account-address">{{
                proposition.endBlock
              }}</span></small
            >
          </div>
          <div class="wrap-votes-stat text-right">
            <div v-if="showVotes">
              <div>
                <button
                  @click="toggleShowVotes()"
                  type="button"
                  class="btn btn-sm btn-color"
                >
                  Hide
                </button>
              </div>
              <span id="accept">{{ this.votes.accept }} accept</span> /
              <span id="deny">{{ this.votes.deny }} deny</span> /
              <span id="reserved">{{ this.votes.reserved }} reserved</span>
            </div>
            <div v-else>
              <button
                @click="toggleShowVotes()"
                type="button"
                class="btn btn-sm btn-color"
              >
                Votes
                <span class="badge badge-pill badge-light">{{
                  this.votes.total
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer card-footer-custom text-center">
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
  name: "PropositionItem",
  data: () => {
    return {
      propositionStatus: 0,
      propositionStatusText: "",
      showVotes: false,
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
    async toggleShowVotes() {
      this.showVotes = !this.showVotes;
      await this.getPropositionVotes();
    },
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
.card-custom {
  background-color: white !important;
}

.card-body-custom {
  background-color: white !important;
}

.card-footer-custom {
  background-color: #e0e0e0;
}

span.prop-status-text {
  font-weight: bold;
}

.wrap-votes-stat {
  margin-top: -1.5rem;
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
