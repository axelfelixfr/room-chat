<template>
  <div class="w-100">
    <b-navbar centered v-if="user">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <figure class="image image-max animate__animated animate__heartBeat">
            <img src="@/assets/img/room-chat.svg?data" alt="Logo" />
          </figure>
        </b-navbar-item>

        <h3 class="navbar_contain animate__animated animate__bounceInDown">
          Room Chat
        </h3>
      </template>

      <template #start>
        <div class="is-hidden-desktop">
          <div class="has-text-dark mx-2">
            Logged as <b>{{ user.displayName }}</b>
          </div>

          <hr class="dropdown-divider" />

          <router-link :to="{ name: 'RoomsView' }">
            <b-navbar-item>
              <b-icon icon="wechat" class="mr-1"></b-icon> Rooms
            </b-navbar-item>
          </router-link>

          <router-link :to="{ name: 'Create' }">
            <b-navbar-item>
              <b-icon icon="tooltip-plus" class="mr-1"></b-icon>
              Create room
            </b-navbar-item>
          </router-link>

          <router-link :to="{ name: 'Profile' }">
            <b-navbar-item>
              <b-icon icon="account-cog" class="mr-1"></b-icon> Profile
            </b-navbar-item>
          </router-link>

          <b-navbar-item class="has-text-danger" @click="doLogout">
            <b-icon icon="logout" class="mr-1"></b-icon>
            Log out
          </b-navbar-item>
        </div>
      </template>

      <template #end>
        <div class="navbar-menu">
          <div class="navbar-end">
            <b-dropdown
              position="is-bottom-left"
              append-to-body
              aria-role="menu"
              v-if="user"
            >
              <template #trigger>
                <a class="navbar-item" role="button">
                  <span>Menu</span>
                  <b-icon icon="menu-down"></b-icon>
                </a>
              </template>

              <b-dropdown-item custom aria-role="menuitem">
                Logged as <b>{{ user.displayName }}</b>
              </b-dropdown-item>

              <hr class="dropdown-divider" />

              <router-link :to="{ name: 'RoomsView' }">
                <b-dropdown-item value="rooms" aria-role="menuitem">
                  <b-icon icon="wechat"></b-icon> Rooms
                </b-dropdown-item>
              </router-link>

              <router-link :to="{ name: 'Create' }">
                <b-dropdown-item value="create">
                  <b-icon icon="tooltip-plus"></b-icon>
                  Create room
                </b-dropdown-item>
              </router-link>

              <router-link :to="{ name: 'Profile' }">
                <b-dropdown-item value="profile" aria-role="menuitem">
                  <b-icon icon="account-cog"></b-icon> Profile
                </b-dropdown-item>
              </router-link>

              <b-dropdown-item
                value="logout"
                aria-role="menuitem"
                @click="doLogout"
              >
                <b-icon icon="logout"></b-icon>
                Log out
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </template>
    </b-navbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "NavbarComponent",
  methods: {
    async doLogout() {
      try {
        await this.$store.dispatch("user/doLogout");
        this.$router.push({ name: "Login" });
        this.$buefy.toast.open({
          message: "Logged out success",
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
    ...mapState("user", ["user"])
  }
};
</script>

<style lang="scss" scoped>
.navbar-item img {
  max-height: none;
}

.navbar__logo {
  width: 200px;
  height: auto;
}

.navbar_contain {
  align-self: center;
  font-size: 30px;
  font-family: "Comfortaa", cursive;
}

.image-max {
  max-width: 70px;
}
</style>
