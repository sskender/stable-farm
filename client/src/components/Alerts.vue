<template>
  <div>
    <b-alert
      variant="primary"
      dismissible
      fade
      :show="alertVisible"
      @dismissed="closeAlert"
    >
      {{ getAlertMessage }}
    </b-alert>
  </div>
</template>

<script>
export default {
  name: "Alerts",
  computed: {
    alertVisible() {
      return this.$store.getters.alertVisible;
    },
    getAlertMessage() {
      return this.$store.getters.alertMessage;
    },
  },
  methods: {
    closeAlert() {
      this.$store.commit("clearAlert");
    },
  },
};
</script>
