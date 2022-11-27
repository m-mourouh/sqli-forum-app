import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/Home";
import ThreadShow from "../views/Thread";
import Forum from "../views/Forum";
import NotFound from "../views/NotFound";
import Profile from "../views/Profile";
import Category from "../views/Category";
import Login from "../views/Login";
import Signup from "../views/Signup";
import ForgetPassword from "../views/ForgetPassword";
import NewThread from "../views/NewThread";
import EditThread from "../views/EditThread"
import { auth } from "../firebase/config"
const routes = [
  { path: "/", component: HomePage, name: "Home" },
  { path: "/forum/:id", component: Forum, name: "Forum", props: true },
  { path: "/category/:id", component: Category, name: "Category", props: true },
  {
    path: "/profile",
    component: Profile,
    name: "Profile",
    meta: {
      requiresAuth: true,
    },
  },
  { path: "/login", component: Login, name: "Login" },
  { path: "/signup", component: Signup, name: "Signup" },
  {
    path: "/forget-password",
    component: ForgetPassword,
    name: "ForgetPassword",
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/new-thread/:id",
    component: NewThread,
    name: "NewThread",
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/update-thread/:forumId/:id",
    component: EditThread,
    name: "EditThread",
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: ThreadShow,
    props: true,
  },
  { path: "/:catchAll(.*)", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// vue-router guards
router.beforeEach( async (to, from, next) => {
  console.log("Router guard",auth.currentUser)
  if (
    (to.path === "/login" || to.path === "/signup") &&  auth.currentUser) {
    next("/");
    return;
  }
  if (
    to.matched.some((record) => record.meta.requiresAuth) && !auth.currentUser) {
    next("/login");
    return;
  }
  next();
});

export default router;
