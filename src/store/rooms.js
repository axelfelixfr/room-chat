import { db, storage } from "../firebase.js";

const state = {
  rooms: [],
  roomsListener: () => {}
};

const getters = {
  getRoom: state => id => {
    return state.rooms.find(room => room.id === id);
  },
  roomsByDate: state => {
    // Ordenamos las salas de chat de acuerdo a su fecha de creación
    return state.rooms.sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }
};

const mutations = {
  setRoomsListener(state, listener) {
    if (listener) {
      state.roomsListener = listener;
    } else {
      state.roomsListener();
    }
  },
  // Nos ayudara a pasar las rooms una vez este autenticado, igual se pasará al estado inicial cuando cierre sessión
  setRooms(state, rooms) {
    state.rooms = rooms;
  },
  createRoom(state, { roomData, id }) {
    roomData.id = id;
    state.rooms.push(roomData);
  },
  updateRoom(state, { index, roomData, id }) {
    roomData.id = id;
    state.rooms[index] = roomData;
  },
  removeRoom(state, index) {
    state.rooms.splice(index, 1);
  }
};

const actions = {
  getRoomNewId() {
    return db.collection("rooms").doc();
  },
  async uploadRoomImage(context, { roomID, file }) {
    const uploadPhoto = () => {
      let fileName = `rooms/${roomID}/${roomID}-image.jpg`;
      // Con ref() le damos una dirección de donde colocar el archivo
      // Con put() subimos el archivo que se recibio
      return storage.ref(fileName).put(file);
    };
    // Obtenemos una URL de descarga
    function getDownloadURL(ref) {
      return ref.getDownloadURL();
    }
    try {
      // Ejecutamos la función uploadPhoto
      let upload = await uploadPhoto();
      // Regresamos una url del archivo que se subio
      return await getDownloadURL(upload.ref);
    } catch (error) {
      throw Error(error.message);
    }
  },
  async createRoom({ rootState }, { name, description, image, roomID }) {
    await db
      .collection("rooms")
      .doc(roomID)
      .set({
        name,
        description,
        createdAt: Date.now(),
        adminUid: rootState.user.user.uid,
        adminName: rootState.user.user.displayName,
        image
      });
  },
  async getRooms({ commit }) {
    const query = db
      .collection("rooms")
      .orderBy("createdAt", "desc")
      .onSnapshot(doSnapshot);
    commit("setRoomsListener", query);
    function doSnapshot(querySnapshot) {
      commit("setLoading", true, { root: true });

      querySnapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          commit("createRoom", {
            roomData: change.doc.data(),
            id: change.doc.id
          });
        }

        if (change.type === "modified") {
          commit("updateRoom", {
            index: change.newIndex,
            roomData: change.doc.data(),
            id: change.doc.id
          });
        }

        if (change.type === "removed") {
          commit("removeRoom", change.oldIndex);
        }
      });
      commit("setLoading", false, { root: true });
    }

    // query.onSnapshot(querySnapshot => {
    //   const rooms = [];
    //   commit("setLoading", true, { root: true });
    //   querySnapshot.forEach(doc => {
    //     let room = doc.data();
    //     room.id = doc.id;
    //     rooms.push(room);
    //   });
    //   commit("setLoading", false, { root: true });
    //   commit("setRooms", rooms);
    // });
  },
  async getRoom({ getters }, roomID) {
    // Se obtiene a través del state local
    let room = getters["getRoom"](roomID);
    if (!room) {
      // Se obtiene desde Firestore
      room = await db
        .collection("rooms")
        .doc(roomID)
        .get();
      // Si no encuentra el room entonces devuelve este mensaje
      if (!room.exists) throw new Error("Could not find room");
      room = room.data();
    }
    return room;
  },
  async updateRoom(context, { roomID, name, description, image }) {
    const roomData = {};
    if (name) {
      roomData.name = name;
    }
    if (description) {
      roomData.description = description;
    }
    roomData.image = image;
    await db
      .collection("rooms")
      .doc(roomID)
      .update(roomData);
  },
  async removeRoom(context, roomID) {
    const room = db.collection("rooms").doc(roomID);
    const messages = room.collection("messages").onSnapshot(doSnaphot);
    async function doSnaphot(snapshot) {
      snapshot.docs.forEach(async doc => {
        await room
          .collection("messages")
          .doc(doc.id)
          .delete();
      });
      messages();
      await room.delete();
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
