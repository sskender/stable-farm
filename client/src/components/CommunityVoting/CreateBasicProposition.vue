<template>
  <div class="wrap-create-proposition">
    <div class="wrap-create-proposition-button">
      <b-button class="btn btn-color" @click="showPropositionModal = true">
        New
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-plus-circle-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"
          />
        </svg>
      </b-button>
    </div>
    <div>
      <b-modal v-model="showPropositionModal" title="Create a new proposition">
        <b-container fluid>
          <PropositionForm v-on:close-modal="showPropositionModal = false" />
        </b-container>
        <template #modal-footer>
          <div class="w-100"></div>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import PropositionForm from "./PropositionForm.vue";

export default {
  name: "CreateBasicProposition",
  data: () => {
    return { showPropositionModal: false };
  },
  components: {
    PropositionForm,
  },
};
</script>

<style>
.wrap-create-proposition-button {
  padding-bottom: 0.5rem;
}
</style>
