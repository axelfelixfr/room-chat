<template>
  <div class="card p-4 mx-3 animate__animated animate__fadeIn">
    <!-- Register form -->
    <div class="card-image">
      <figure class="image is-3by1">
        <!-- <Logo /> -->
        <img src="@/assets/img/room-chat.svg?data" alt="Logo" />
      </figure>
    </div>
    <h1 class="title has-text-centered">Register</h1>

    <form @submit.prevent="doRegister">
      <b-field
        label="Name"
        :type="{
          'is-danger': submitted && $v.userRegis.name.$error,
          'is-success': submitted && !$v.userRegis.name.$error
        }"
        :message="{
          'Name is required': submitted && !$v.userRegis.name.required,
          'Name must be at least 4 characters':
            submitted && !$v.userRegis.name.minLength,
          'Name must be at most 20 characters':
            submitted && !$v.userRegis.name.maxLength
        }"
      >
        <b-input
          :class="{
            'animate__animated animate__headShake animate__fast':
              submitted && $v.userRegis.name.$error
          }"
          v-model="userRegis.name"
          icon="account"
          type="text"
          maxlength="20"
          :loading="isLoading"
        ></b-input>
      </b-field>

      <b-field
        label="Email"
        :type="{
          'is-danger': submitted && $v.userRegis.email.$error,
          'is-success': submitted && !$v.userRegis.email.$error
        }"
        :message="{
          'Email is required': submitted && !$v.userRegis.email.required,
          'Must be a valid email': submitted && !$v.userRegis.email.email
        }"
      >
        <b-input
          :class="{
            'animate__animated animate__headShake animate__fast':
              submitted && $v.userRegis.email.$error
          }"
          v-model="userRegis.email"
          icon="email"
          type="text"
          maxlength="40"
          :loading="isLoading"
        ></b-input>
      </b-field>

      <b-field
        label="Password"
        :type="{
          'is-danger': submitted && $v.userRegis.password.$error,
          'is-success': submitted && !$v.userRegis.password.$error
        }"
        :message="{
          'Password is required': submitted && !$v.userRegis.password.required,
          'Password must be at least 8 characters':
            submitted && !$v.userRegis.password.minLength,
          'Password must be at most 20 characters':
            submitted && !$v.userRegis.password.maxLength
        }"
      >
        <b-input
          type="password"
          :class="{
            'animate__animated animate__headShake animate__fast':
              submitted && $v.userRegis.password.$error
          }"
          v-model="userRegis.password"
          icon="lock"
          maxlength="20"
          password-reveal
          :loading="isLoading"
        >
        </b-input>
      </b-field>

      <b-field
        label="Confirm password"
        :type="{
          'is-danger': submitted && $v.userRegis.confirmPassword.$error,
          'is-success': submitted && !$v.userRegis.confirmPassword.$error
        }"
        :message="{
          'Passwords do not match!':
            submitted && !$v.userRegis.confirmPassword.sameAsPassword
        }"
      >
        <b-input
          type="password"
          :class="{
            'animate__animated animate__headShake animate__fast':
              submitted && $v.userRegis.confirmPassword.$error
          }"
          v-model="userRegis.confirmPassword"
          icon="lock-reset"
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
            icon-right="account-plus"
            type="is-success"
            :loading="isLoading"
            >Register</b-button
          >
        </div>
      </div>
      <router-link to="/auth/login">Want to login?</router-link>
    </form>
    <!-- End of register form -->
  </div>
</template>

<script>
// import Logo from "@/assets/img/room-chat.svg?inline";
import {
  required,
  minLength,
  maxLength,
  sameAs,
  email
} from "vuelidate/lib/validators";

export default {
  name: "FormRegister",
  // props: {
  //   imageLogo: {
  //     required: true
  //   }
  // },
  // components: {
  //   Logo
  // },
  data() {
    return {
      isLogin: true,
      isLoading: false,
      userRegis: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      submitted: false
    };
  },
  validations: {
    userRegis: {
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(20)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(20)
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs("password")
      }
    }
  },
  methods: {
    redirect() {
      this.$router.push({ name: "RoomsView" });
    },
    resetData() {
      this.userRegis.name = this.userRegis.email = this.userRegis.password = this.userRegis.confirmPassword =
        "";
    },
    async doRegister() {
      this.submitted = true;
      this.isLoading = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
        return;
      } else {
        try {
          await this.$store.dispatch("user/doRegister", {
            name: this.userRegis.name,
            email: this.userRegis.email,
            password: this.userRegis.password
          });
          // this.$toast.success("Account created");
          this.$buefy.toast.open({
            message: "Account created",
            type: "is-success"
          });
          this.redirect();
          this.resetData();
        } catch (error) {
          // this.$toast.error(error.message);
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
