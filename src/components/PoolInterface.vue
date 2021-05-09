<template>
  <div>
    <div>
      Pool <span>{{ this.assetName }}</span> (<span>{{ this.assetSymbol }}</span
      >)
    </div>
    <div>
      Address: <span>{{ this.assetAddress }}</span>
    </div>
    <div>
      APY: <span>{{ this.currentAPY }}</span
      >%
    </div>
    <div>
      Best APY: <span>{{ this.bestAPY }}</span
      >%
    </div>
    <button>Deposit</button>
    <button>Withdraw</button>
    <button>Rebalance</button>
    <div>
      <span>{{ this.poolAddress }}</span>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import contract from "@truffle/contract";

const provider = new Web3.providers.HttpProvider("http://localhost:8545");

export default {
  props: {
    poolJson: Object,
  },
  data: () => {
    return {
      instance: null,
      poolAddress: null,
      assetName: null,
      assetSymbol: null,
      assetAddress: null,
      currentAPY: 0.0,
      bestAPY: 0.0,
    };
  },
  methods: {
    async loadContract() {
      const poolContract = contract(this.poolJson);
      poolContract.setProvider(provider);
      const instance = await poolContract.deployed();

      this.instance = instance;
    },
    async loadContractData() {
      // general data
      this.poolAddress = this.instance.address;
      this.assetName = await this.instance.getAssetName();
      this.assetSymbol = await this.instance.getAssetSymbol();
      this.assetAddress = await this.instance.getAssetAddress();

      // currently farming APY
      const currentAPYRaw = await this.instance.getAPY();
      const currentAPYScaled = Number(currentAPYRaw);
      this.currentAPY = currentAPYScaled / 1e2;

      // best available APY
      const bestAPYArray = await this.instance.getBestAPY();
      const bestAPYScaled = Number(bestAPYArray[1]) / 1e2;
      this.bestAPY = bestAPYScaled;
    },
  },
  async created() {
    console.log(this.poolABI);

    await this.loadContract();
    await this.loadContractData();
  },
};
</script>

<style scoped></style>
