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
    <input type="number" v-model="tokenInputValue" />Inputed
    {{ this.tokenInputValue }}
    <button v-on:click="makeApproval">Approve</button>
    <button v-on:click="makeDeposit">Deposit</button>
    <button v-on:click="makeWithdrawalAll">Withdraw</button>
    <button>Rebalance</button>
    <div>
      <span>{{ this.poolAddress }}</span>
    </div>
  </div>
</template>

<script>
import contract from "@truffle/contract";
import Erc20Json from "../../build/contracts/Erc20.json";

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
      tokenInputValue: 0,
    };
  },
  methods: {
    async loadContract() {
      const poolContract = contract(this.poolJson);
      poolContract.setProvider(window.web3._provider);
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
      this.currentAPY = (currentAPYScaled / 1e27).toFixed(2);

      // best available APY
      const bestAPYArray = await this.instance.getBestAPY();
      const bestAPYScaled = (Number(bestAPYArray[1]) / 1e2).toFixed(2);
      this.bestAPY = bestAPYScaled;
    },
    async getMantisa() {
      const underlyingAddress = await this.instance.getAssetAddress();
      console.log({ underlyingAddress });

      const web3 = window.web3;
      const underlyingToken = new web3.eth.Contract(
        Erc20Json.abi,
        underlyingAddress
      );

      var underlyingDecimals;
      try {
        underlyingDecimals = await underlyingToken.methods.decimals().call();
      } catch (err) {
        underlyingDecimals = 6;
      }

      const value = Number(this.tokenInputValue);
      const amount = (value * Math.pow(10, underlyingDecimals)).toString();

      console.log(`mantissa amount: ${amount}`);
      return amount;
    },
    async makeApproval() {
      const amount = await this.getMantisa();
      console.log(`approving for ${amount}`);

      // TODO change dai with underlying asset address
      const web3 = window.web3;
      const msgSender = window.account;

      const underlyingAddress = await this.instance.getAssetAddress();
      const poolAddress = this.instance.address;
      const tokenContract = new web3.eth.Contract(
        Erc20Json.abi,
        underlyingAddress
      );

      // approve
      await tokenContract.methods
        .approve(poolAddress, amount)
        .send({ from: msgSender });
    },
    async makeDeposit() {
      const amount = await this.getMantisa();
      console.log(`depositing ${amount}`);

      const msgSender = window.account;
      console.log({ msgSender });

      const poolAddress = this.instance.address;
      console.log({ poolAddress });

      // make deposit
      const poolContract = contract(this.poolJson);
      poolContract.setProvider(window.web3._provider);
      const instance = await poolContract.deployed();

      await instance.deposit(amount, { from: msgSender });
    },
    async makeWithdrawalAll() {
      console.log(`withdrawing all`);
      const poolContract = contract(this.poolJson);
      poolContract.setProvider(window.web3._provider);
      const instance = await poolContract.deployed();

      const msgSender = window.account;
      await instance.withdrawAll({ from: msgSender });
    },
  },
  async created() {
    await this.loadContract();
    await this.loadContractData();
  },
};
</script>

<style scoped></style>
