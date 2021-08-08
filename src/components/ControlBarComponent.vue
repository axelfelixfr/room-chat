<template>
  <section class="send">
    <form @submit.prevent="createMessage" class="form">
      <div class="control" :class="{ 'is-loading': isLoading }">
        <textarea
          v-model="message"
          class="textarea form__textarea"
          placeholder="Write your message here..."
        ></textarea>
      </div>
      <div
        v-if="photo"
        @click="photo = null"
        class="photo-preview"
        :style="{ 'background-image': `url(${messagePhoto})` }"
      ></div>
      <div v-if="audio" class="audio-preview">
        <a href="#" @click="audio = null" class="close">X</a>
        <audio class="width-audio" :src="messageAudio" controls></audio>
      </div>
      <div class="control">
        <b-button
          native-type="button"
          @click="recordAudio"
          type="is-primary is-light"
          icon-right="microphone"
          rounded
          :disabled="isLoading"
          :loading="isLoading"
        />
      </div>
      <div class="control">
        <b-button
          native-type="button"
          @click="$refs.file.click()"
          type="is-primary is-light"
          class="mx-2"
          icon-right="image-plus"
          rounded
          :disabled="isLoading"
          :loading="isLoading"
        />
        <input
          @change="onFileChange"
          ref="file"
          type="file"
          class="inputfile"
          style="display: none !important;"
        />
      </div>
      <b-button
        native-type="submit"
        type="is-primary"
        icon-right="send"
        rounded
        :disabled="!message"
        :loading="isLoading"
      />
    </form>
  </section>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  name: "ControlBarComponent",
  props: ["isLoading"],
  data() {
    return {
      message: "",
      photo: null,
      audio: null,
      filter: null,
      originalLoading: this.isLoading,
      submitted: false
    };
  },
  validations: {
    message: {
      required
    }
  },
  methods: {
    async onFileChange(event) {
      this.photo = event.target.files[0];
      this.$refs.file.value = null;

      try {
        this.filter = await this.$store.dispatch("utils/requestConfirmation", {
          props: {
            message: "Select your filter",
            file: this.messagePhoto,
            filters: this.$store.state.messages.filters
          },
          component: "FilterModal"
        });
      } catch (error) {
        console.log(error.message);
        this.$buefy.toast.open({
          duration: 4000,
          message: error.message,
          type: "is-danger"
        });
      }
    },
    async recordAudio() {
      try {
        this.audio = await this.$store.dispatch("utils/requestConfirmation", {
          props: {
            message: "Record your voice"
          },
          component: "RecordModal"
        });
      } catch (error) {
        console.log(error.message);
        this.$buefy.toast.open({
          duration: 4000,
          message: error.message,
          type: "is-danger"
        });
      }
    },
    createMessage() {
      this.submitted = true;
      this.originalLoading = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.originalLoading = false;
        return;
      } else {
        this.$emit("create-message", {
          message: this.message,
          photo: this.photo,
          audio: this.audio,
          filter: this.filter
        });
        this.message = "";
        this.photo = this.filter = this.audio = null;
      }
    }
  },
  computed: {
    messagePhoto() {
      return URL.createObjectURL(this.photo);
    },
    messageAudio() {
      return URL.createObjectURL(this.audio);
    }
  }
};
</script>

<style lang="scss" scoped>
.send {
  background-color: gray;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  .photo-preview {
    width: 5rem;
    height: 5rem;
    border: 1px solid;
    background-position: center;
    background-size: cover;
    margin-right: 1rem;
    border-radius: 1rem;
    cursor: pointer;
  }
  .audio-preview {
    margin-right: 1rem;
    cursor: pointer;
    position: relative;
    .close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1rem 1rem 0.95rem 1.5rem;
      font-weight: bold;
      background-color: #f14668;
      color: white;
      text-decoration: none;
      z-index: 1;
    }
    .width-audio {
      max-width: 100px;
    }
  }
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > *:first-child {
    flex-grow: 1;
    margin-right: 1rem;
  }
}
.textarea.form__textarea {
  min-height: 4rem;
  resize: vertical !important;
}
</style>
