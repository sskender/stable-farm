<template>
  <div>
    <div>
      Pool <span>{{ this.assetName }}</span> (
      <a v-bind:href="'https://etherscan.io/token/' + this.assetAddress">
        <span>{{ this.assetSymbol }}</span>
      </a>
      )
    </div>
    <div>
      Current APY: <span>{{ this.currentAPY }}</span
      >% Best available APY: <span>{{ this.bestAPY }}</span
      >%
      <button>Rebalance</button>
    </div>
    <div>
      Balance: <span>{{ this.tokenBalance }}</span
      ><br />
      <input type="number" v-model="tokenInputValue" />
      <button v-on:click="loadInputMaxBalance">Max</button>
    </div>
    <div>
      <button v-on:click="makeApproval">Approve</button>
      <button v-on:click="makeDeposit">Deposit</button>
      <button v-on:click="makeWithdrawalAll">Withdraw</button>
    </div>
    <div>
      Contract address: <span>{{ this.poolAddress }}</span>
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
      poolAddress: null,
      assetName: null,
      assetSymbol: null,
      assetAddress: null,
      currentAPY: 0.0,
      bestAPY: 0.0,
      tokenBalance: 0,
      tokenInputValue: 0,
    };
  },
  methods: {
    async loadContractInfo() {
      const instance = await this.getContractInstance();

      this.poolAddress = instance.address;
      this.assetName = await instance.getAssetName();
      this.assetSymbol = await instance.getAssetSymbol();
      this.assetAddress = await instance.getAssetAddress();
    },

    async loadAPYData() {
      const instance = await this.getContractInstance();

      // best available APY
      const numberOfDecimalPlacesBestAPY = 1e2;
      const bestAPYArray = await instance.getBestAPY();
      const bestAPYScaled = (
        Number(bestAPYArray[1]) / numberOfDecimalPlacesBestAPY
      ).toFixed(2);
      this.bestAPY = bestAPYScaled;

      // currently farming APY
      const numberOfDecimalPlacesCurrentAPY = 1e27;
      const currentAPYRaw = await instance.getAPY();
      const currentAPYScaled = Number(currentAPYRaw);
      this.currentAPY = (
        currentAPYScaled / numberOfDecimalPlacesCurrentAPY
      ).toFixed(2);
    },

    async getContractInstance() {
      const web3 = window.web3;
      const poolContract = contract(this.poolJson);
      poolContract.setProvider(web3._provider);
      const instance = await poolContract.deployed();
      return instance;
    },

    async getUnderlyingToken() {
      const web3 = window.web3;
      const instance = await this.getContractInstance();
      const underlyingAddress = await instance.getAssetAddress();
      const underlyingToken = new web3.eth.Contract(
        Erc20Json.abi,
        underlyingAddress
      );
      return underlyingToken;
    },

    async getUnderlyingDecimals() {
      const underlyingToken = await this.getUnderlyingToken();
      var underlyingDecimals;
      try {
        underlyingDecimals = await underlyingToken.methods.decimals().call();
        underlyingDecimals = Number(underlyingDecimals);
      } catch (err) {
        underlyingDecimals = 6;
      }
      return underlyingDecimals;
    },

    async getAvailableBalance() {
      const msgSender = window.account;
      const underlyingToken = await this.getUnderlyingToken();
      const underlyingDecimals = await this.getUnderlyingDecimals();

      if (!msgSender) {
        return 0;
      }

      const balance = await underlyingToken.methods.balanceOf(msgSender).call();
      const balanceScaled = Number(balance) / Math.pow(10, underlyingDecimals);
      return balanceScaled;
    },

    async loadAvailableBalance() {
      const balance = await this.getAvailableBalance();
      this.tokenBalance = balance.toFixed(2);
    },

    async loadInputMaxBalance() {
      const balance = await this.getAvailableBalance();
      this.tokenInputValue = balance;
    },

    async getMantissa(value) {
      const underlyingDecimals = await this.getUnderlyingDecimals();
      const amount = (value * Math.pow(10, underlyingDecimals)).toString();
      return amount;
    },

    async makeApproval() {
      const value = Number(this.tokenInputValue);
      const amount = await this.getMantissa(value);

      const poolAddress = this.poolAddress;
      const msgSender = window.account;

      const underlyingToken = await this.getUnderlyingToken();
      await underlyingToken.methods
        .approve(poolAddress, amount)
        .send({ from: msgSender });
    },

    async makeDeposit() {
      const value = Number(this.tokenInputValue);
      const amount = await this.getMantissa(value);

      const msgSender = window.account;

      const instance = await this.getContractInstance();
      await instance.deposit(amount, { from: msgSender });

      await this.loadAPYData();
      await this.loadAvailableBalance();
      this.tokenInputValue = 0;
    },

    async makeWithdrawal() {
      // TODO
    },

    async makeWithdrawalAll() {
      const msgSender = window.account;

      const instance = await this.getContractInstance();
      await instance.withdrawAll({ from: msgSender });

      await this.loadAPYData();
      await this.loadAvailableBalance();
      this.tokenInputValue = 0;
    },
  },
  async created() {
    await this.loadContractInfo();
    await this.loadAPYData();
    await this.loadAvailableBalance();
  },
};
</script>

<style scoped></style>
