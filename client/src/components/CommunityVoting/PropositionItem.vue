<template>
  <div>
    <p>{{ proposition.title }}</p>
    <p>{{ proposition.description }}</p>
    <p>
      Proposed by <span>{{ proposition.proposedBy }}</span>
    </p>
    <div>
      Start: <span>{{ proposition.startBlock }}</span> End:
      <span>{{ proposition.endBlock }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {};
  },
  props: {
    proposition: Object,
  },
};
</script>

<style scoped>
</style>
