import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Validación
import Vuelidate from "vuelidate";

import Buefy from "buefy";
// import 'buefy/dist/buefy.css';

Vue.use(Vuelidate);

require("./assets/css/main.scss");
Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
