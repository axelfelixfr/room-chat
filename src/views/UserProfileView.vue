<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <div class="card p-4 mx-3 animate__animated animate__fadeIn">
            <h1 class="title has-text-centered">Profile</h1>

            <!-- Profile form -->
            <form v-if="user" @submit.prevent="updateProfile">
              <b-field
                label="Name"
                :type="{
                  'is-danger': submitted && $v.userProfile.name.$error,
                  'is-success': submitted && !$v.userProfile.name.$error
                }"
                :message="{
                  'Name must be at least 4 characters':
                    submitted && !$v.userProfile.name.minLength,
                  'Name must be at most 20 characters':
                    submitted && !$v.userProfile.name.maxLength
                }"
              >
                <b-input
                  :class="{
                    'animate__animated animate__headShake animate__fast':
                      submitted && $v.userProfile.name.$error
                  }"
                  v-model="userProfile.name"
                  :placeholder="user.displayName"
                  icon="account"
                  type="text"
                  maxlength="20"
                  :loading="isLoading"
                ></b-input>
              </b-field>

              <b-field
                label="Email"
                :type="{
                  'is-danger': submitted && $v.userProfile.email.$error,
                  'is-success': submitted && !$v.userProfile.email.$error
                }"
                :message="{
                  'Must be a valid email':
                    submitted && !$v.userProfile.email.email
                }"
              >
                <b-input
                  :class="{
                    'animate__animated animate__headShake animate__fast':
                      submitted && $v.userProfile.email.$error
                  }"
                  v-model="userProfile.email"
                  :placeholder="user.email"
                  icon="email"
                  type="text"
                  maxlength="40"
                  :loading="isLoading"
                ></b-input>
              </b-field>

              <b-field
                label="Password"
                :type="{
                  'is-danger': submitted && $v.userProfile.password.$error,
                  'is-success': submitted && !$v.userProfile.password.$error
                }"
                :message="{
                  'Password must be at least 8 characters':
                    submitted && !$v.userProfile.password.minLength,
                  'Password must be at most 20 characters':
                    submitted && !$v.userProfile.password.maxLength
                }"
              >
                <b-input
                  type="password"
                  :class="{
                    'animate__animated animate__headShake animate__fast':
                      submitted && $v.userProfile.password.$error
                  }"
                  v-model="userProfile.password"
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
                  'is-danger':
                    submitted && $v.userProfile.confirmPassword.$error,
                  'is-success':
                    submitted && !$v.userProfile.confirmPassword.$error
                }"
                :message="{
                  'Passwords do not match!':
                    submitted && !$v.userProfile.confirmPassword.sameAsPassword
                }"
              >
                <b-input
                  type="password"
                  :class="{
                    'animate__animated animate__headShake animate__fast':
                      submitted && $v.userProfile.confirmPassword.$error
                  }"
                  v-model="userProfile.confirmPassword"
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
                    icon-right="account-check"
                    :disabled="!hasDataChanged"
                    type="is-success"
                    :loading="isLoading"
                    >Update</b-button
                  >
                </div>
              </div>
            </form>
            <!-- End profile form -->
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { minLength, maxLength, email, sameAs } from "vuelidate/lib/validators";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      userProfile: {
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      submitted: false
    };
  },
  validations: {
    userProfile: {
      name: {
        minLength: minLength(4),
        maxLength: maxLength(20)
      },
      email: {
        email
      },
      password: {
        minLength: minLength(8),
        maxLength: maxLength(20)
      },
      confirmPassword: {
        sameAsPassword: sameAs("password")
      }
    }
  },
  methods: {
    async updateProfile() {
      this.submitted = true;
      this.isLoading = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.isLoading = false;
        return;
      } else {
        try {
          await this.$store.dispatch("user/updateProfile", {
            name: this.userProfile.name,
            email: this.userProfile.email,
            password: this.userProfile.password
          });
          // this.$toast.success("Account data updated successfully");
          this.$buefy.toast.open({
            duration: 3000,
            message: "Account data updated successfully",
            type: "is-success"
          });
          this.userProfile.name = this.userProfile.email = this.userProfile.password = this.userProfile.confirmPassword =
            "";
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
  },
  computed: {
    ...mapState("user", ["user"]),
    hasDataChanged() {
      return (
        // Name exits and is different
        (this.userProfile.name &&
          this.userProfile.name !== this.user.displayName) ||
        // Email exists and is different
        (this.userProfile.email &&
          this.userProfile.email !== this.user.email) ||
        // Password exists
        this.userProfile.password.length
      );
    }
  }
};
</script>
