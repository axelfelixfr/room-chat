<template>
  <b-modal :width="450" trap-focus v-model="isCardModalActive">
    <b-message type="is-danger" has-icon>
      <header>
        <h3 class="subtitle is-size-3 is-maginless">Confirmation</h3>
      </header>

      <div class="content is-align-items-flex-start">
        <div class="media-content my-3">
          <small class="subtitle">{{ message }}</small>
        </div>
        <div class="buttons">
          <b-button @click="$emit('confirm')" :class="actionClass"
            >Confirm</b-button
          >
          <b-button @click="$emit('cancel')" type="is-success">Cancel</b-button>
        </div>
      </div>
    </b-message>
  </b-modal>
</template>

<script>
export default {
  name: "ConfirmationModalComponent",
  props: {
    message: {
      type: String,
      required: true
    },
    actionClass: {
      type: String,
      default: "is-danger"
    }
  },
  data() {
    return {
      isCardModalActive: true
    };
  }
};
</script>
