<template>
  <div class="card p-4 mx-3 animate__animated animate__fadeIn">
    <!-- Reset Form -->
    <div class="card-image">
      <figure class="image is-3by1">
        <!-- <img :src="imageLogo" alt="Logo" /> -->
        <!-- <Logo /> -->
        <img src="@/assets/img/room-chat.svg?data" alt="Logo" />
      </figure>
    </div>
    <h1 class="title has-text-centered">Reset password</h1>
    <form @submit.prevent="doReset">
      <b-field
        label="Email"
        :type="{
          'is-danger': submitted && $v.email.$error,
          'is-success': submitted && !$v.email.$error
        }"
        :message="{
          'Email is required': submitted && !$v.email.required,
          'Must be a valid email': submitted && !$v.email.email
        }"
      >
        <b-input
          :class="{
            'animate__animated animate__headShake animate__fast':
              submitted && $v.email.$error
          }"
          v-model="email"
          icon="email"
          type="text"
          maxlength="40"
          :loading="isLoading"
        ></b-input>
      </b-field>

      <div class="field has-text-right">
        <div class="control">
          <b-button
            native-type="submit"
            icon-right="lock-reset"
            type="is-success"
            :loading="isLoading"
            >Reset</b-button
          >
        </div>
      </div>
      <router-link to="/auth/register">Don't have an account?</router-link>
    </form>
    <!-- End of reset form -->
  </div>
</template>

<script>
// import Logo from "@/assets/img/room-chat.svg?inline";
import { required, email } from "vuelidate/lib/validators";

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
      email: "",
      submitted: false
    };
  },
  validations: {
    email: {
      required,
      email
    }
  },
  methods: {
    async doReset() {
      this.submitted = true;
      this.isLoading = true;

      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
        return;
      } else {
        try {
          await this.$store.dispatch("user/doReset", this.email);
          // this.$toast.success(
          //   `Please check ${this.email} for further instructions`
          // );
          this.$buefy.toast.open({
            duration: 3000,
            message: `Please check ${this.email} for further instructions`,
            type: "is-success"
          });
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
