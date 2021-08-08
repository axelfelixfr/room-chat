<template>
  <div v-if="!$store.state.isLoading">
    <h1 v-if="!rooms.length" class="subtitle has-text-centered mt-2">
      No rooms available
      <router-link :to="{ name: 'Create' }">create one</router-link>
    </h1>
    <div v-else class="columns is-multiline">
      <!-- Room element -->
      <div v-for="room in rooms" :key="room.id" class="column is-one-quarter">
        <router-link :to="{ name: 'View', params: { id: room.id } }">
          <div
            class="card room animate__animated animate__bounce animate__pulse animate__faster"
            :class="{ unread: hasUnreadMessages(room.id).length }"
          >
            <div class="card-image">
              <div
                v-if="hasUnreadMessages(room.id).length"
                class="unread-alert"
              >
                {{ hasUnreadMessages(room.id).length }} unread messages 🎉🔥
              </div>
              <figure class="image">
                <div
                  class="room__image"
                  :style="{
                    'background-image': `url(${getRoomImage(room.id)})`
                  }"
                ></div>
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-content overflow-card">
                  <p class="title is-4">{{ room.name }}</p>
                  <p class="subtitle is-6">
                    by <strong>{{ room.adminName }}</strong>
                  </p>
                </div>
              </div>
              <div class="content mb-0 is-hidden-touch">
                {{ room.description }}
              </div>
              <nav class="buttons is-right">
                <b-button
                  v-if="room.adminUid === $store.getters['user/getUserUid']"
                  size="is-small"
                  tag="router-link"
                  icon-right="pencil"
                  :to="{ name: 'UpdateRoom', params: { id: room.id } }"
                  type="is-info"
                  >Edit</b-button
                >
              </nav>
            </div>
          </div>
        </router-link>
      </div>
      <!-- End of Room element -->
    </div>
  </div>
  <div v-else>
    <section>
      <article class="media" v-for="i in media" :key="i">
        <figure class="media-left">
          <p class="image is-64x64">
            <b-skeleton circle width="64px" height="64px"></b-skeleton>
          </p>
        </figure>
        <div class="media-content pr-5">
          <div class="content">
            <p>
              <b-skeleton active></b-skeleton>
              <b-skeleton height="64px"></b-skeleton>
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a class="level-item">
                <span class="icon is-small">
                  <b-skeleton></b-skeleton>
                </span>
              </a>
              <a class="level-item">
                <span class="icon is-small">
                  <b-skeleton></b-skeleton>
                </span>
              </a>
            </div>
          </nav>
        </div>
        <figure class="media-left">
          <p class="image is-64x64">
            <b-skeleton circle width="64px" height="64px"></b-skeleton>
          </p>
        </figure>
        <div class="media-content pr-5">
          <div class="content">
            <p>
              <b-skeleton active></b-skeleton>
              <b-skeleton height="64px"></b-skeleton>
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a class="level-item">
                <span class="icon is-small">
                  <b-skeleton></b-skeleton>
                </span>
              </a>
              <a class="level-item">
                <span class="icon is-small">
                  <b-skeleton></b-skeleton>
                </span>
              </a>
            </div>
          </nav>
        </div>
        <figure class="media-left">
          <p class="image is-64x64">
            <b-skeleton circle width="64px" height="64px"></b-skeleton>
          </p>
        </figure>
        <div class="media-content pr-5">
          <div class="content">
            <p>
              <b-skeleton active></b-skeleton>
              <b-skeleton height="64px"></b-skeleton>
            </p>
          </div>
          <nav class="level is-mobile">
            <div class="level-left">
              <a class="level-item">
                <span class="icon is-small">
                  <b-skeleton></b-skeleton>
                </span>
              </a>
              <a class="level-item">
                <span class="icon is-small">
                  <b-skeleton></b-skeleton>
                </span>
              </a>
            </div>
          </nav>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: "RoomsComponent",
  data() {
    return {
      media: 3
    };
  },
  props: {
    rooms: {
      type: Array,
      require: true
    },
    unreadMessages: {
      type: Array
    }
  },
  methods: {
    getRoomImage(roomId) {
      const room = this.rooms.find(room => room.id === roomId);
      return room.image ? room.image : require("@/assets/img/room-chat.svg");
    },
    hasUnreadMessages(roomId) {
      return this.unreadMessages.filter(message => {
        return message.roomId === roomId;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.room {
  position: relative;
  &.unread {
    border: 3px solid orange;
    animation: slidein 0.6s infinite alternate ease-in-out;
  }
  .unread-alert {
    position: absolute;
    top: 0;
    right: 0;
    background-color: orange;
    padding: 1rem;
    z-index: 2;
  }
  .room__image {
    height: 12vmax;
    background-size: cover;
    background-position: center;
  }
  .overflow-card {
    overflow-y: hidden;
  }
}
@keyframes slidein {
  from {
    transform: translateY(-1rem);
  }
  to {
    transform: translateY(1rem);
  }
}
</style>
