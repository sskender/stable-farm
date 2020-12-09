<template>
  <div class="wrap-token-info">
    <h3>{{ this.tokenName }}</h3>
    <div>
      <table>
        <th>Contract wallet info</th>
        <tr>
          <td>Address</td>
          <td>{{ this.contractAddress }}</td>
        </tr>
        <tr>
          <td>Symbol</td>
          <td>{{ this.tokenSymbol }}</td>
        </tr>
        <tr>
          <td>Granularity</td>
          <td>{{ this.tokenGranularity }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import DaoTokenContract from "./../providers/DaoTokenContract";

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
      const address = await DaoTokenContract.options.address;
      this.contractAddress = address;
    },
    async getName() {
      const name = await DaoTokenContract.methods.name().call();
      this.tokenName = name;
    },
    async getSymbol() {
      const symbol = await DaoTokenContract.methods.symbol().call();
      this.tokenSymbol = symbol;
    },
    async getGranularity() {
      const granularity = await DaoTokenContract.methods.granularity().call();
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

