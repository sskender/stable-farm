<template>
  <div class="membership">
    <div>
      Balance:
      <span>{{myBalance}} token</span>
    </div>
    <div>
      <div v-if="isMintable">Token is mintable</div>
      <div v-else>Token is not mintable</div>
    </div>
    <MintBurn :myBalance="myBalance" :isMintable="isMintable" />
    <Minting :isMintable="isMintable" />
  </div>
</template>

<script>
import MintBurn from "./MembershipMintBurn.vue";
import Minting from "./MembershipMinting.vue";

export default {
  components: { MintBurn, Minting },
  props: {
    myBalance: Number,
  },
  methods: {
    checkIsMintable() {
      this.isMintable = true;
    },
  },
  data() {
    return { isMintable: true };
  },
  created() {
    this.checkIsMintable();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.membership {
  border-style: solid;
  border-width: 10px;
  border-color: purple;
}
</style>
