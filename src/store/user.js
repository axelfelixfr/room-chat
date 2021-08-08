import { auth, db, fb } from "../firebase";

const state = {
  user: null,
  // metadato, se guardará la información del usuario para saber cuando se conecto, sabiendo la última conexión y en que parte esta conectado
  meta: {},
  userListener: () => {}
};

const getters = {
  getUserUid(state) {
    if (state.user) {
      return state.user.uid;
    } else {
      return state.user;
    }
  }
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setMeta(state, meta) {
    if (meta) {
      state.meta = meta;
    } else {
      state.meta;
    }
  },
  setUserListener(state, listener) {
    if (listener) {
      state.userListener = listener;
    } else {
      state.userListener();
    }
  }
};

const actions = {
  getCurrentUser() {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        user => {
          unsubscribe();
          resolve(user);
        },
        () => {
          reject();
        }
      );
    });
  },
  async updateMeta(context, { roomID, exit, uid }) {
    const ref = db.collection("users").doc(uid);
    const userDoc = await ref.get();

    if (!userDoc.exists) await ref.set({});

    // El método del FieldValue dependera de si el usuario ha salido o no
    const method = exit ? "arrayRemove" : "arrayUnion";
    // Con arrayRemove removemos el valor de connect
    // Con arrayUnion agregaremos el valor de connect
    await ref.update({
      connected: fb.firestore.FieldValue[method](roomID),
      [`joined.${roomID}`]: Date.now()
    }); // Usamos update para cambiar la propiedad connect
  },
  async getMeta({ state, commit }) {
    const ref = db.collection("users").doc(state.user.uid);
    // const userDoc = await ref.get();

    if (!ref.exists) await ref.set({});

    await ref.update({ connected: [] });

    const query = ref.onSnapshot(doSnapshot);

    commit("setUserListener", query);

    function doSnapshot(doc) {
      commit("setMeta", doc.data());
    }
  },
  async updateProfile({ commit, state }, { name, email, password }) {
    const user = auth.currentUser;

    if (name) {
      await user.updateProfile({
        displayName: name
      });

      db.runTransaction(async transaction => {
        const query = await db
          .collectionGroup("messages")
          .where("userId", "==", state.user.uid)
          .get();

        query.forEach(doc => {
          transaction.update(doc.ref, { userName: name });
        });
      });
    }

    if (email) {
      await user.updateEmail(email);
    }

    if (password) {
      await user.updatePassword(password);
    }

    commit("setUser", user);
  },
  async doLogin({ commit }, { email, password }) {
    await auth.signInWithEmailAndPassword(email, password);
    commit("setUser", auth.currentUser);
    // currentUser será null si no hay nadie autenticado, por lo tanto cuando se identifica currentUser es la información
    // del usuario autenticado
  },
  async doRegister({ commit }, { name, email, password }) {
    await auth.createUserWithEmailAndPassword(email, password);
    const user = auth.currentUser;
    // Con updateProfile podemos acceder a las propiedades del user, en este caso le pasamos el name del formulario
    await user.updateProfile({
      displayName: name
    });
    commit("setUser", user);
  },
  async doLogout({ commit }) {
    await auth.signOut();
    // commit("setUser", null);
    commit("messages/setMessagesListener", null, { root: true });
    commit("rooms/setRoomsListener", null, { root: true });
    commit("setUserListener", null);
  },
  async doReset(context, email) {
    await auth.sendPasswordResetEmail(email);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
