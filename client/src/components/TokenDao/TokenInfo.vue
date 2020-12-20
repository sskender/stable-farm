<template>
  <div class="wrap-token-info">
    <h3>{{ this.tokenName }}</h3>
    <div>
      <table>
        <th>Token contract information</th>
        <tr>
          <td>Address</td>
          <td>{{ this.contractAddress }}</td>
        </tr>
        <tr>
          <td>Symbol</td>
          <td>{{ this.tokenSymbol }}</td>
        </tr>
        <tr>
          <td>Decimals</td>
          <td>{{ this.tokenGranularity }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
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
      const address = await contract.options.address;
      this.contractAddress = address;
    },
    async getName() {
      const contract = this.$store.state.DaoTokenContract;
      const name = await contract.methods.name().call();
      this.tokenName = name;
    },
    async getSymbol() {
      const contract = this.$store.state.DaoTokenContract;
      const symbol = await contract.methods.symbol().call();
      this.tokenSymbol = symbol;
    },
    async getGranularity() {
      const contract = this.$store.state.DaoTokenContract;
      const granularity = await contract.methods.granularity().call();
      this.tokenGranularity = Number(granularity);
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
</style>

