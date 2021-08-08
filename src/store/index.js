import Vue from "vue";
import Vuex from "vuex";
// Importamos los modulos para Vuex
import messages from "./messages";
import rooms from "./rooms";
import user from "./user";
import utils from "./utils";
// Importamos el auth de firebase
import { auth } from "../firebase.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isLoading: true
  },
  mutations: {
    setLoading(state, loading) {
      state.isLoading = loading;
    }
  },
  actions: {
    // Checamos lo autentificación
    checkAuth({ dispatch, commit }) {
      // Para mantener el state de autenticado, usamos el método onAuthStateChanged
      auth.onAuthStateChanged(async function(user) {
        // Si existe el usuario entonces que haga el commit con el user
        if (user) {
          commit("user/setUser", user);
          try {
            await dispatch("rooms/getRooms");
            await dispatch("messages/getMessages");
            await dispatch("user/getMeta");
          } catch (error) {
            console.log(error);
          }
        } else {
          commit("user/setMeta", {});
          commit("user/setUserListener", null);

          // Si no existe manda null
          commit("rooms/setRooms", []);
          commit("rooms/setRoomsListener", null);

          commit("messages/setMessages", []);
          commit("messages/setMessagesListener", null);

          commit("user/setUser", null);
        }
      });
    }
  },
  modules: {
    messages,
    rooms,
    user,
    utils
  }
});

export default store;

// Initial load
store.dispatch("checkAuth"); // Hacemos el dispatch de la action checkAuth
