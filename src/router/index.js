import Vue from "vue";
import VueRouter from "vue-router";
// Convertimos los import a const, para que solo se rendericen cuando sean llamados
const RoomsView = () => import("../views/RoomsView.vue");
const AuthView = () => import("../views/AuthView.vue");
const FormLogin = () => import("../components/FormLogin.vue");
const FormRegister = () => import("../components/FormRegister.vue");
const UserProfileView = () => import("../views/UserProfileView.vue");
const FormResetPassword = () => import("../components/FormResetPassword.vue");
const CreateRoom = () => import("../views/CreateRoom.vue");
const RoomUpdate = () => import("../views/RoomUpdate.vue");
const RoomMessagesView = () => import("../views/RoomMessagesView.vue");
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RoomsView",
    component: RoomsView,
    meta: {
      requiresAuth: true,
      title: "Room Chat"
    }
  },
  {
    path: "/auth",
    name: "Auth",
    component: AuthView,
    children: [
      {
        path: "login",
        name: "Login",
        component: FormLogin,
        meta: { title: "Room Chat | Login" }
      },
      {
        path: "register",
        name: "Register",
        component: FormRegister,
        meta: { title: "Room Chat | Register" }
      },
      {
        path: "reset",
        name: "Reset",
        component: FormResetPassword,
        meta: { title: "Room Chat | Reset Password" }
      }
    ]
  },
  {
    path: "/profile",
    name: "Profile",
    component: UserProfileView,
    meta: {
      requiresAuth: true,
      title: "Room Chat | Profile"
    }
  },
  {
    path: "/create",
    name: "Create",
    component: CreateRoom,
    meta: {
      requiresAuth: true,
      title: "Room Chat | New Room"
    }
  },
  {
    path: "/update/:id",
    name: "UpdateRoom",
    props: true,
    component: RoomUpdate,
    meta: {
      requiresAuth: true,
      title: "Room Chat | Update Room"
    }
  },
  {
    path: "/view/:id",
    name: "View",
    props: true,
    component: RoomMessagesView,
    meta: {
      requiresAuth: true,
      title: "Room Chat | Messages"
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !(await store.dispatch("user/getCurrentUser"))) {
    next({ name: "Login" });
  } else if (!requiresAuth && (await store.dispatch("user/getCurrentUser"))) {
    next({ name: "RoomsView" });
  } else {
    next();
  }
});

export default router;
