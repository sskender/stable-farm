<template>
  <div class="pool-wrapper">
    <div id="info-container">
      <div id="pool-name">
        Pool <span>{{ this.assetName }}</span> (
        <a v-bind:href="'https://etherscan.io/token/' + this.assetAddress">
          <span>{{ this.assetSymbol }}</span>
        </a>
        )
      </div>
      <div id="pool-address">
        Source: <span>{{ this.poolAddress }}</span>
      </div>
    </div>

    <div id="apy-container">
      <div class="apy">
        <div class="apy-value">
          <span>{{ this.currentAPY }}</span> %
        </div>
        <div class="apy-info">(current) APY</div>
      </div>
      <div class="apy">
        <div class="apy-value">
          <span class="apy">{{ this.bestAPY }}</span> %
        </div>
        <div class="apy-info">(best) APY</div>
      </div>
    </div>

    <div id="action-container">
      <div class="balance-container">
        Balance: <span>{{ this.tokenBalance }}</span>
        <span>{{ " " + this.assetSymbol }}</span>
      </div>
      <div>
        <input id="input-box" type="number" v-model="tokenInputValue" />
        <button
          class="btn-action"
          id="btn-max"
          v-on:click="loadInputMaxBalance"
        >
          Max
        </button>
        <button class="btn-action" v-on:click="makeApproval">Approve</button>
        <button class="btn-action" v-on:click="makeDeposit">Deposit</button>
        <button class="btn-action" v-on:click="makeWithdrawalAll">
          Withdraw
        </button>
        <button class="btn-action" v-on:click="makeRebalance">Rebalance</button>
      </div>
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
        (currentAPYScaled / numberOfDecimalPlacesCurrentAPY) *
        100
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

    async makeWithdrawalAll() {
      const msgSender = window.account;

      const instance = await this.getContractInstance();
      await instance.withdrawAll({ from: msgSender });

      await this.loadAPYData();
      await this.loadAvailableBalance();
      this.tokenInputValue = 0;
    },

    async makeRebalance() {
      const msgSender = window.account;

      const instance = await this.getContractInstance();
      try {
        await instance.rebalance({ from: msgSender });
      } catch (err) {
        console.error(err);
      }

      await this.loadAPYData();
    },
  },
  async created() {
    await this.loadContractInfo();
    await this.loadAPYData();
    await this.loadAvailableBalance();
  },
};
</script>

<style scoped>
div.pool-wrapper {
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 25px;
  padding-right: 25px;
  border-style: solid;
  border-width: 5px;
  border-color: #fafafa;
  border-radius: 20px;
  width: fit-content;
}

div#info-container {
}

div#pool-name {
  font-size: 20px;
  font-weight: bold;
}

div#pool-address {
  font-size: 12px;
  color: #abb2c8;
}

div#apy-container {
  margin-top: 20px;
  margin-bottom: 20px;
  display: table;
  width: 100%;
  color: #abb2c8;
}

div.apy {
  float: left;
  width: 6rem;
  text-align: center;
}

div.apy-value {
  font-size: 18px;
  font-weight: bold;
  color: #2aff99;
}

div.apy-info {
  font-size: 12px;
}

div#action-container {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 15px;
  margin-right: 15px;
}

div.balance-container {
  font-size: 12px;
}

input#input-box {
  border-radius: 10px;
  border-width: 2px;
  border-color: #fafafa;
}

button#btn-max {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 20px;
  width: auto;
}

button.btn-action {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 20px;
  background-color: #7ff5bc;
  border-color: #fafafa;
  border-style: solid;
  border-width: 2px;
}
</style>
