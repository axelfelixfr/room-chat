<template>
  <!-- <section class="section">
      <div class="container has-text-centered">
        <button v-if="!user" @click="doLogin" class="button">
          Login with Google
        </button>
        <template v-else>
          <h1 class="title has-text-centered">Hi {{ user.displayName }}</h1>
          <button @click="doLogout" class="button">Logout</button>
        </template>
      </div>
    </section> -->
  <section class="section">
    <div class="container">
      <h1 class="title has-text-centered">
        Rooms
      </h1>
      <!-- <form>
        <input type="file" @change="doUpload" />
      </form> -->
      <RoomsComponent
        :unread-messages="unreadMessages"
        :rooms="$store.getters['rooms/roomsByDate']"
      />
    </div>
  </section>
</template>

<script>
import { storage } from "../firebase";
import { mapState } from "vuex";
import RoomsComponent from "../components/RoomsComponent.vue";

export default {
  name: "RoomsView",
  methods: {
    doUpload(event) {
      // Obtener el archivo
      const file = event.target.files[0];

      // Crear referencia
      const ref = storage.ref("images/" + file.name);

      // Subir el archivo
      const upload = ref.put(file);

      // Supervisar el proceso
      upload.on(
        "state_changed",
        function progress(snapshot) {
          console.warn((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        function error(error) {
          console.error(error);
        },
        function complete() {
          console.info("Finished uploading!");
        }
      );
    }
  },
  computed: {
    ...mapState("rooms", ["rooms"]),
    ...mapState("messages", ["messages"]),
    ...mapState("user", ["meta"]),
    unreadMessages() {
      return this.messages.filter(message => {
        if (this.meta.joined) {
          return (
            // User participated
            this.meta.joined[message.roomId] &&
            // Message send after user last connection
            this.meta.joined[message.roomId] < message.createdAt
          );
        } else {
          return null;
        }
      });
    }
  },
  components: {
    RoomsComponent
  }
};
// import { fb, auth } from "../firebase";

// export default {
//   name: "RoomsView",
//   data() {
//     return {
//       user: null,
//     };
//   },
//   methods: {
//     async doLogin() {
//       try {
//         const provider = new fb.auth.GoogleAuthProvider();
//         const user = await auth.signInWithPopup(provider);
//         this.user = user.user;
//       } catch (error) {
//         console.log(error.message);
//       }
//     },
//     async doLogout() {
//       try {
//         await auth.signOut();
//         this.user = null;
//       } catch (error) {
//         console.log(error.message);
//       }
//     },
//   },
// };

// import { db } from "../firebase";
</script>
