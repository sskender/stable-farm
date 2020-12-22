<template>
  <div class="wrap-token-mint">
    <h4 v-if="mintingEnabled">We are accepting new members!</h4>
    <h4 v-else>We are not accepting new members at the moment</h4>
    <div
      class="connect-wallet"
      v-if="mintingEnabled && !this.$store.state.accountAddress"
    >
      Connect your wallet to join
    </div>
    <div
      class="wrap-join"
      v-if="
        mintingEnabled &&
        !this.$store.state.member &&
        this.$store.state.accountAddress
      "
    >
      <p>Claim your membership token now</p>
      <button id="btn-join" class="btn btn-info" v-on:click="mintToken">
        JOIN
      </button>
    </div>
    <div class="admin-center" v-if="this.$store.state.chairmanConnected">
      <h5>Admin center</h5>
      <span>Minting new tokens</span>
      <button
        class="btn-mint btn btn-danger"
        v-if="mintingEnabled"
        v-on:click="disableMinting"
      >
        DISABLE
      </button>
      <button
        class="btn-mint btn btn-success"
        v-else
        v-on:click="enableMinting"
      >
        ENABLE
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TokenMint",
  data: () => {
    return {
      mintingEnabled: false,
    };
  },
  methods: {
    async getMintingStatus() {
      const contract = this.$store.state.DaoTokenContract;
      try {
        const minting = await contract.methods.isMintable().call();
        this.mintingEnabled = minting;
      } catch (err) {
        console.error(err);
      }
    },
    async enableMinting() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.enableMinting().send({ from: caller });
        this.mintingEnabled = true;
      } catch (err) {
        console.error(err);
        window.alert("Unable to mint");
      }
    },
    async disableMinting() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.disableMinting().send({ from: caller });
        this.mintingEnabled = false;
      } catch (err) {
        console.error(err);
        window.alert("Unable to mint");
      }
    },
    async mintToken() {
      const caller = this.$store.state.accountAddress;
      const contract = this.$store.state.DaoTokenContract;

      try {
        await contract.methods.mint().send({ from: caller });
      } catch (err) {
        console.error(err);
        window.alert("Unable to mint");
      }
    },
  },
  async created() {
    await this.getMintingStatus();
  },
};
</script>

<style scoped>
h4 {
  padding-left: 5%;
}

.connect-wallet {
  padding-top: 5%;
  text-align: center;
}

.wrap-join {
  padding-top: 5%;
  text-align: center;
}

.btn-mint {
  margin-left: 10px;
}

.admin-center {
  padding-top: 30px;
}

#btn-join {
  padding-left: 30px;
  padding-right: 30px;
  margin-left: 10px;
}
</style>

