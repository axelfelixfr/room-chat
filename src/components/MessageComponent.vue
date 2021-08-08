<template>
  <div
    @click="$emit('select-message', message.id)"
    class="message"
    :class="{
      'message--own': message.userId === $store.getters['user/getUserUid'],
      'animate__animated animate__shakeX': message.id === messageIDSelected
    }"
  >
    <!-- Delete message -->
    <b-button
      class="message__delete is-pulled-right"
      @click="$emit('delete-message', message.id)"
      type="is-danger"
      icon-right="close-thick"
      v-if="deleteAnimate && message.id === messageIDSelected"
      size="is-small"
    />
    <!-- Message has photo -->
    <div
      v-if="message.photo"
      class="message__photo"
      :class="message.filter"
      :style="{ 'background-image': `url(${message.photo})` }"
    ></div>

    <!-- Message has audio -->
    <div v-if="message.audio" class="message__audio">
      <audio :src="message.audio" controls></audio>
    </div>

    <!-- Message text -->
    <p class="my-0 is-align-items-end">
      {{ message.message }}
      <span
        v-if="message.userId !== $store.getters['user/getUserUid']"
        class="my-0"
      >
        <br />
        <small class="message__time"
          ><i
            >{{ message.userName }} {{ message.createdAt | timeAgo }} ago</i
          ></small
        >
      </span>
    </p>
  </div>
</template>

<script>
const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
export default {
  name: "MessageComponent",
  props: {
    message: {
      type: Object,
      required: true
    },
    deleteAnimate: {
      type: Boolean,
      required: true
    },
    messageIDSelected: {
      required: true
    }
  },
  filters: {
    timeAgo(timestamp) {
      const date = new Date(timestamp);
      return dayjs().from(dayjs(date), true);
    }
  }
};
</script>

<style lang="scss" scoped>
.message {
  padding: 1rem;
  width: 75%;
  &--own {
    background-color: #41b883;
    color: white;
    width: 75%;
    align-self: flex-end;
  }
  &__time {
    color: gray;
    font-size: 12px;
    float: right;
  }
  &__photo {
    height: 20vmax;
    background-size: cover;
    background-position: center;
  }
  &__delete {
    position: relative;
    z-index: 1;
  }
}
</style>
