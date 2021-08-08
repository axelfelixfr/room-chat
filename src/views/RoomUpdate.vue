<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <div class="card p-4 mx-3 animate__animated animate__fadeIn">
            <h1 class="title has-text-centered">Edit Room</h1>
            <!-- Room Form -->
            <form v-if="room" @submit.prevent="updateRoom">
              <b-field
                label="Name"
                :type="{
                  'is-danger': submitted && $v.room.name.$error,
                  'is-success': submitted && !$v.room.name.$error
                }"
                :message="{
                  'Name is required': submitted && !$v.room.name.required,
                  'Name must be at least 4 characters':
                    submitted && !$v.room.name.minLength,
                  'Name must be at most 20 characters':
                    submitted && !$v.room.name.maxLength
                }"
              >
                <b-input
                  :class="{
                    'animate__animated animate__headShake animate__fast':
                      submitted && $v.room.name.$error
                  }"
                  v-model="room.name"
                  :placeholder="room.name"
                  icon="border-color"
                  type="text"
                  maxlength="20"
                  :loading="isLoading"
                ></b-input>
              </b-field>

              <b-field
                label="Description"
                :type="{
                  'is-danger': submitted && $v.room.description.$error,
                  'is-success': submitted && !$v.room.description.$error
                }"
                :message="{
                  'Description is required':
                    submitted && !$v.room.description.required,
                  'Description must be at least 8 characters':
                    submitted && !$v.room.description.minLength,
                  'Description must be at most 100 characters':
                    submitted && !$v.room.description.maxLength
                }"
              >
                <b-input
                  :class="{
                    'animate__animated animate__headShake animate__fast':
                      submitted && $v.room.description.$error
                  }"
                  v-model="room.description"
                  :placeholder="room.description"
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

              <div class="field is-grouped is-grouped-right mt-5">
                <div class="control">
                  <b-button
                    native-type="submit"
                    type="is-success"
                    icon-right="content-save"
                    :disabled="!hasDataChanged"
                    :loading="isLoading"
                    >Save</b-button
                  >
                </div>
                <div class="control">
                  <b-button
                    native-type="button"
                    @click="removeRoom"
                    type="is-danger"
                    icon-right="delete"
                    >Delete</b-button
                  >
                </div>
              </div>
            </form>
            <!-- End of Room Form -->
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { minLength, required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "RoomUpdate",
  async created() {
    try {
      this.room = await this.$store.dispatch("rooms/getRoom", this.id);
      this.imageURL = this.room.image;
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
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      room: null,
      image: null,
      imageURL: null,
      isLoading: false,
      submitted: false
    };
  },
  validations: {
    room: {
      name: {
        minLength: minLength(4),
        maxLength: maxLength(20),
        required
      },
      description: {
        minLength: minLength(8),
        maxLength: maxLength(100),
        required
      }
    }
  },
  methods: {
    onFileChange(event) {
      this.image = event.target.files[0];
      this.imageURL = URL.createObjectURL(this.image);
      this.$refs.file.value = null;
    },
    async updateRoom() {
      this.submitted = true;
      this.isLoading = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
        return;
      } else {
        try {
          if (this.image) {
            this.imageURL = await this.$store.dispatch(
              "rooms/uploadRoomImage",
              {
                roomID: this.id,
                file: this.image
              }
            );
          }
          await this.$store.dispatch("rooms/updateRoom", {
            roomID: this.id,
            name: this.room.name,
            description: this.room.description,
            image: this.imageURL
          });
          this.$buefy.toast.open({
            message: "Room data updated",
            type: "is-success"
          });
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
    },
    async removeRoom() {
      try {
        await this.$store.dispatch("utils/requestConfirmation", {
          props: { message: "Remove room?" },
          component: "ConfirmationModal"
        });
        await this.$store.dispatch("rooms/removeRoom", this.id);
        this.$buefy.toast.open({
          message: "Room removed",
          type: "is-success"
        });
        this.$router.push({ name: "RoomsView" });
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
    roomImage() {
      return this.imageURL
        ? this.imageURL
        : require("@/assets/img/room-chat.svg");
    },
    hasDataChanged() {
      return this.room.name || this.room.description;
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
