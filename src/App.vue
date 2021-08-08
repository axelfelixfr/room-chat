<template>
  <div id="app">
    <NavbarComponent />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import NavbarComponent from "./components/NavbarComponent.vue";

export default {
  name: "App",
  components: {
    NavbarComponent
  }
};
</script>

<style>
body,
html {
  font-family: "Titillium Web", "Assistant", sans-serif;
}

h1 {
  font-family: "Comfortaa", cursive;
}

textarea {
  resize: none !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
