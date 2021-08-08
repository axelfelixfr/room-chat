<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <template>
            <router-view />
          </template>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
// import Logo from "@/assets/img/room-chat.svg?inline";
export default {
  data() {
    return {
      // image: Logo
    };
  }
};
</script>
