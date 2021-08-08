<template>
  <div class="card p-4 mx-3 animate__animated animate__fadeIn">
    <!-- Login Form -->
    <div class="card-image">
      <figure class="image is-3by1">
        <img src="@/assets/img/room-chat.svg?data" alt="Logo" />
      </figure>
    </div>
    <h1 class="title has-text-centered">Login</h1>
    <form @submit.prevent="doLogin">
      <b-field
        label="Email"
        :type="{
          'is-danger': submitted && $v.userLogin.email.$error,
          'is-success': submitted && !$v.userLogin.email.$error
        }"
        :message="{
          'Email is required': submitted && !$v.userLogin.email.required,
          'Must be a valid email': submitted && !$v.userLogin.email.email
        }"
      >
        <b-input
          :class="{
            'animate__animated animate__headShake animate__fast':
              submitted && $v.userLogin.email.$error
          }"
          v-model="userLogin.email"
          icon="email"
          type="text"
          maxlength="40"
          :loading="isLoading"
        ></b-input>
      </b-field>

      <b-field
        label="Password"
        :type="{
          'is-danger': submitted && $v.userLogin.password.$error,
          'is-success': submitted && !$v.userLogin.password.$error
        }"
        :message="{
          'Password is required': submitted && !$v.userLogin.password.required,
          'Password must be at least 8 characters':
            submitted && !$v.userLogin.password.minLength,
          'Password must be at most 20 characters':
            submitted && !$v.userLogin.password.maxLength
        }"
      >
        <b-input
          type="password"
          :class="{
            'animate__animated animate__headShake animate__fast':
              submitted && $v.userLogin.password.$error
          }"
          v-model="userLogin.password"
          icon="lock"
          maxlength="20"
          password-reveal
          :loading="isLoading"
        >
        </b-input>
      </b-field>

      <div class="field has-text-right">
        <div class="control">
          <b-button
            native-type="submit"
            icon-right="account-key"
            type="is-success"
            :loading="isLoading"
            >Login</b-button
          >
        </div>
      </div>
      <router-link class="is-block" to="/auth/register"
        >Don't have an account?</router-link
      >
      <router-link to="/auth/reset">Forgot your password</router-link>
    </form>
    <!-- End of login form -->
  </div>
</template>

<script>
// import Logo from "?inline";
import {
  required,
  minLength,
  maxLength,
  email
} from "vuelidate/lib/validators";

export default {
  name: "FormLogin",
  // components: {
  //   Logo
  // },
  // props: {
  //   imageLogo: {
  //     required: true
  //   }
  // },
  data() {
    return {
      isLogin: true,
      isLoading: false,
      userLogin: {
        email: "",
        password: ""
      },
      submitted: false
    };
  },
  validations: {
    userLogin: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(20)
      }
    }
  },
  methods: {
    redirect() {
      this.$router.push({ name: "RoomsView" });
    },
    resetData() {
      this.userLogin.email = this.userLogin.password = "";
    },
    async doLogin() {
      this.submitted = true;
      this.isLoading = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
        return;
      } else {
        try {
          await this.$store.dispatch("user/doLogin", {
            email: this.userLogin.email,
            password: this.userLogin.password
          });
          this.$buefy.toast.open({
            message: "Logged in success",
            type: "is-success"
          });
          this.redirect();
          this.resetData();
        } catch (error) {
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
  }
};
</script>
