<template>
  <div class="info-panel">
    <TokenInfo :tokenName="tokenName" :tokenSymbol="tokenSymbol" :tokenSupply="tokenSupply" />
    <UserInfo :myAddress="myAddress" :myBalance="myBalance" />
  </div>
</template>

<script charset="utf-8">
import TokenInfo from "./InfoPanelToken.vue";
import UserInfo from "./InfoPanelUser.vue";

export default {
  components: { TokenInfo, UserInfo },
  props: {
    myAddress: String,
    myBalance: Number,
  },
  methods: {
    getTokenName() {
      this.tokenName = "My token test";
    },
    getTokenSymbol() {
      this.tokenSymbol = "MTT";
    },
    getTokenSupply() {
      this.tokenSupply = 42;
    },
  },
  data() {
    // store data from token contract
    return {
      tokenName: null,
      tokenSymbol: null,
      tokenSupply: 0,
    };
  },
  created() {
    // load data about token
    this.getTokenName();
    this.getTokenSymbol();
    this.getTokenSupply();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.info-panel {
  border-style: solid;
  border-width: 10px;
  border-color: blue;
}
</style>
