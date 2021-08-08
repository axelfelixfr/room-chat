<template>
  <div>
    <article class="full-hd">
      <div class="container">
        <div class="columns">
          <div v-if="room" class="column is-half is-offset-one-quarter">
            <h1 class="title has-text-centered mt-2">{{ room.name }}</h1>
            <div class="content-messages" ref="messages">
              <div
                class="messages content m-4"
                v-for="message in roomMessages"
                :key="message.id"
              >
                <MessageComponent
                  :message="message"
                  :deleteAnimate="deleteAnimate"
                  :messageIDSelected="messageIDSelected"
                  @select-message="selectMessage"
                  @delete-message="deleteMessage"
                />
              </div>
            </div>
            <ControlBarComponent
              :is-loading="isLoading"
              @create-message="createMessage"
            />
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MessageComponent from "../components/MessageComponent.vue";
import ControlBarComponent from "../components/ControlBarComponent.vue";

export default {
  name: "RoomMessagesView",
  components: {
    MessageComponent,
    ControlBarComponent
  },
  async created() {
    this.userUid = this.$store.state.user.user.uid;
    try {
      this.room = await this.$store.dispatch("rooms/getRoom", this.id);
      // this.$store.dispatch("messages/getMessages", this.id);
      this.$store.dispatch("user/updateMeta", {
        roomID: this.id,
        exit: false,
        uid: this.userUid
      });
    } catch (error) {
      console.log(error.message);
      // Se lanza en pantalla el toast con el mensaje: "Could not find room"
      this.$buefy.toast.open({
        duration: 4000,
        message: error.message,
        type: "is-danger"
      });
      this.$router.push({ name: "RoomsView" });
    }
  },
  destroyed() {
    // Destruimos la escucha de los mensajes al salir del room
    // this.$store.commit("messages/setMessagesListener", null);
    this.$store.dispatch("user/updateMeta", {
      roomID: this.id,
      exit: true,
      uid: this.userUid
    });
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      userUid: false,
      isLoading: false,
      photoURL: null,
      audioURL: null,
      room: null,
      deleteAnimate: false,
      messageIDSelected: null
    };
  },

  methods: {
    selectMessage(messageID) {
      this.messageIDSelected = messageID;
      this.deleteAnimate = true;
    },

    scrollDown() {
      const messages = this.$refs.messages;
      this.$nextTick(() => {
        const height = messages.scrollHeight;
        window.scrollTo({
          top: height,
          behavior: "smooth"
        });
      });
    },

    async createMessage({ message, photo, audio, filter }) {
      try {
        if (photo) {
          this.photoURL = await this.$store.dispatch(
            "messages/uploadMessageFile",
            {
              roomID: this.id,
              file: photo,
              type: "photo"
            }
          );
        }
        if (audio) {
          this.audioURL = await this.$store.dispatch(
            "messages/uploadMessageFile",
            {
              roomID: this.id,
              file: audio,
              type: "audio"
            }
          );
        }
        await this.$store.dispatch("messages/createMessage", {
          roomID: this.id,
          message: message,
          photo: this.photoURL,
          filter: filter,
          audio: this.audioURL
        });
        this.scrollDown();
        this.photoURL = this.audioURL = null;
      } catch (error) {
        console.log(error.message);
        this.$buefy.toast.open({
          duration: 4000,
          message: error.message,
          type: "is-danger"
        });
      } finally {
        this.isLoading = false;
      }
    },
    async deleteMessage(messageID) {
      this.messageIDSelected = messageID;
      try {
        await this.$store.dispatch("utils/requestConfirmation", {
          props: { message: "Delete message?" },
          component: "ConfirmationModal"
        });
        const message = this.roomMessages.find(
          message => message.id === messageID
        );
        if (message.photo) {
          await this.$store.dispatch("messages/deleteFile", message.photo);
        }
        if (message.audio) {
          await this.$store.dispatch("messages/deleteFile", message.audio);
        }
        await this.$store.dispatch("messages/deleteMessage", {
          roomID: this.id,
          messageID
        });
        this.$buefy.toast.open({
          message: "Message deleted",
          type: "is-success"
        });
      } catch (error) {
        console.log(error.message);
        this.$buefy.toast.open({
          duration: 4000,
          message: error.message,
          type: "is-danger"
        });
      }
    }
  },
  computed: {
    ...mapState("messages", ["messages"]),
    roomMessages() {
      return this.messages.filter(message => message.roomId === this.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.messages {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.content-messages {
  padding-bottom: 90px;
}
</style>
