<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <div class="card p-4 mx-3 animate__animated animate__fadeIn">
            <h1 class="title has-text-centered">Create Room</h1>
            <form @submit.prevent="createRoom">
              <b-field
                label="Name"
                :type="{
                  'is-danger': submitted && $v.roomData.name.$error,
                  'is-success': submitted && !$v.roomData.name.$error
                }"
                :message="{
                  'Name is required': submitted && !$v.roomData.name.required,
                  'Name must be at least 4 characters':
                    submitted && !$v.roomData.name.minLength,
                  'Name must be at most 20 characters':
                    submitted && !$v.roomData.name.maxLength
                }"
              >
                <b-input
                  :class="{
                    'animate__animated animate__headShake animate__fast':
                      submitted && $v.roomData.name.$error
                  }"
                  v-model="roomData.name"
                  icon="border-color"
                  type="text"
                  maxlength="20"
                  :loading="isLoading"
                ></b-input>
              </b-field>

              <b-field
                label="Description"
                :type="{
                  'is-danger': submitted && $v.roomData.description.$error,
                  'is-success': submitted && !$v.roomData.description.$error
                }"
                :message="{
                  'Description is required':
                    submitted && !$v.roomData.description.required,
                  'Description must be at least 8 characters':
                    submitted && !$v.roomData.description.minLength,
                  'Description must be at most 100 characters':
                    submitted && !$v.roomData.description.maxLength
                }"
              >
                <b-input
                  :class="{
                    'animate__animated animate__headShake animate__fast':
                      submitted && $v.roomData.description.$error
                  }"
                  v-model="roomData.description"
                  type="textarea"
                  maxlength="100"
                  :loading="isLoading"
                ></b-input>
              </b-field>

              <div class="field">
                <label class="label">Image</label>
                <div class="control">
                  <div
                    class="room__image"
                    :style="{
                      'background-image': `url(${roomImage})`
                    }"
                  >
                    <a
                      href="#"
                      v-if="image"
                      @click.prevent="image = roomData.imageURL = null"
                      class="is-pulled-right button is-small is-danger is-outlined"
                      ><b-icon icon="close-thick" size="is-medium"></b-icon
                    ></a>
                  </div>
                  <div class="file">
                    <label class="file-label">
                      <input
                        class="file-input"
                        type="file"
                        @change="onFileChange"
                        ref="file"
                      />
                      <span class="file-cta">
                        <span class="file-label">
                          Choose a image
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="has-text-right">
                <div class="control">
                  <b-button
                    native-type="submit"
                    icon-right="chat-plus"
                    type="is-success"
                    :loading="isLoading"
                    >Create</b-button
                  >
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  name: "CreateRoom",
  data() {
    return {
      isLoading: false,
      image: null,
      roomData: {
        name: "",
        description: "",
        imageURL: ""
      },
      submitted: false
    };
  },
  validations: {
    roomData: {
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(20)
      },
      description: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(100)
      }
    }
  },
  methods: {
    onFileChange(event) {
      this.image = event.target.files[0];
      this.$refs.file.value = null;
    },
    redirect() {
      // setTimeout(() => this.$router.push({ name: "Home" }), 1000);
      this.$router.push({ name: "RoomsView" });
    },
    resetData() {
      this.roomData.name = this.roomData.description = this.roomData.imageURL =
        "";
    },
    async createRoom() {
      this.submitted = true;
      this.isLoading = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
        return;
      } else {
        try {
          const newRoom = await this.$store.dispatch("rooms/getRoomNewId");
          const roomID = newRoom.id;
          if (this.image) {
            this.roomData.imageURL = await this.$store.dispatch(
              "rooms/uploadRoomImage",
              {
                roomID,
                file: this.image
              }
            );
          }
          await this.$store.dispatch("rooms/createRoom", {
            name: this.roomData.name,
            description: this.roomData.description,
            image: this.roomData.imageURL,
            roomID
          });
          this.$buefy.toast.open({
            message: "Room created successfully",
            type: "is-success"
          });
          // this.redirect();
          this.$router.push({ name: "View", params: { id: newRoom.id } });
          this.resetData();
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
      }
    }
  },
  computed: {
    roomImage() {
      return this.image
        ? URL.createObjectURL(this.image)
        : require("@/assets/img/room-chat.svg");
    }
  }
};
</script>

<style lang="scss" scoped>
.room__image {
  height: 15vmax;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #dbdbdb;
  background-size: cover;
  background-position: center;
}
</style>
