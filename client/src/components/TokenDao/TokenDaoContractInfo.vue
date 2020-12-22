<template>
  <div class="wrap-token-info">
    <h3>{{ this.tokenName }}</h3>
    <div class="token-contract-info">
      <table>
        <th>Token contract information</th>
        <tr>
          <td>Address</td>
          <td>
            <span class="account-address">{{ this.contractAddress }}</span>
          </td>
        </tr>
        <tr>
          <td>Symbol</td>
          <td>
            <span class="account-address">{{ this.tokenSymbol }}</span>
          </td>
        </tr>
        <tr>
          <td>Decimals</td>
          <td>
            <span class="account-address">{{ this.tokenGranularity }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TokenDaoContractInfo",
  data: () => {
    return {
      tokenName: null,
      tokenSymbol: null,
      tokenGranularity: null,
      contractAddress: null,
    };
  },
  methods: {
    async getContractAddress() {
      const contract = this.$store.state.DaoTokenContract;
      try {
        const address = await contract.options.address;
        this.contractAddress = address;
      } catch (err) {
        console.error(err);
      }
    },
    async getName() {
      const contract = this.$store.state.DaoTokenContract;
      try {
        const name = await contract.methods.name().call();
        this.tokenName = name;
      } catch (err) {
        console.error(err);
      }
    },
    async getSymbol() {
      const contract = this.$store.state.DaoTokenContract;
      try {
        const symbol = await contract.methods.symbol().call();
        this.tokenSymbol = symbol;
      } catch (err) {
        console.error(err);
      }
    },
    async getGranularity() {
      const contract = this.$store.state.DaoTokenContract;
      try {
        const granularity = await contract.methods.granularity().call();
        this.tokenGranularity = Number(granularity);
      } catch (err) {
        console.error(err);
      }
    },
  },
  async created() {
    await this.getName();
    await this.getContractAddress();
    await this.getSymbol();
    await this.getGranularity();
  },
};
</script>

<style scoped>
h3 {
  padding-left: 2%;
  padding-bottom: 2%;
}
</style>

