<template>
  <b-modal :width="450" trap-focus v-model="isCardModalActive">
    <b-message
      :title="message"
      type="is-success"
      aria-close-label="Close record modal"
    >
      <section class="has-text-centered">
        <b-button
          v-if="!recorder"
          @click="record()"
          icon-right="play-circle-outline"
          type="is-ghost"
          size="is-large"
          expanded
        />
        <b-button
          v-else
          @click="stop()"
          icon-right="stop-circle-outline"
          type="is-ghost"
          size="is-large"
          expanded
        />
        <div class="mt-5" v-if="audio">
          <h5 class="subtitle is-marginless mb-1">Review your recording</h5>
          <audio :src="newAudioURL" controls></audio>
        </div>
      </section>
      <footer class="buttons is-right">
        <b-button
          @click="$emit('confirm', audio)"
          :disabled="!audio"
          :class="actionClass"
          >Confirm</b-button
        >
        <b-button @click="$emit('cancel')" type="is-danger">Cancel</b-button>
      </footer>
    </b-message>
  </b-modal>
</template>

<script>
export default {
  name: "RecordModalComponent",
  props: {
    message: {
      type: String,
      required: true
    },
    actionClass: {
      type: String,
      default: "is-primary"
    }
  },
  data() {
    return {
      audio: null,
      recorder: null,
      isCardModalActive: true
    };
  },
  methods: {
    async record() {
      try {
        this.audio = null;
        // Usamos mediaDevices para pedir audio, no video
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });

        const options = { mimeType: "audio/webm" };
        const recordedChunks = [];
        this.recorder = new MediaRecorder(stream, options);

        this.recorder.addEventListener("dataavailable", e => {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });
        this.recorder.addEventListener("stop", () => {
          this.audio = new Blob(recordedChunks);
        });
        this.recorder.start();
      } catch (error) {
        console.log(error.message);
        this.$buefy.toast.open({
          duration: 4000,
          message: error.message,
          type: "is-danger"
        });
      }
    },
    stop() {
      this.recorder.stop();
      this.recorder = null;
    }
  },
  computed: {
    newAudioURL() {
      return URL.createObjectURL(this.audio);
    }
  }
};
</script>

<style></style>
