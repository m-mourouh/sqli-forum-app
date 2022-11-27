import { createStore } from "vuex";
import data from "../data/db.json";
// firebase imports
import {
  auth,
  db,
  setDoc,
  addDoc,
  updateDoc,
  arrayUnion,
} from "../firebase/config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  getDoc,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import router from "@/router";

const store = createStore({
  state: {
    authUser: null,
    authIsReady: false,
    dataIsReady: false,
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    postToUpdate: null,
    postIsEditable: false,
    users: [],
  },
  mutations: {
    setAuthUser(state, payload) {
      state.authUser = payload;
      console.log("User state changed", state.authUser);
    },
    setUserAvatar(state,url){
      state.authUser.avatar = url;
    },
    setUserPostsCount(state) {
      state.authUser.postsCount = state.posts.filter(
        (post) => post.userId === state.authUser.id
      ).length;
    },
    setAuthIsReady(state, payload) {
      state.authIsReady = payload;
    },

    setCategories(state, querySnapshot) {
      let categories = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const category = {
          id: doc.id,
          ...doc.data(),
        };
        categories.push(category);
      });
      state.categories = categories;
    },
    setPosts(state, querySnapshot) {
      let posts = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const post = {
          id: doc.id,
          ...doc.data(),
        };
        posts.push(post);
      });
      state.posts = posts.sort((p1, p2) =>
        p1.publishedAt > p2.publishedAt
          ? 1
          : p1.publishedAt < p2.publishedAt
          ? -1
          : 0
      );
    },
    setEditPost(state, postId) {
      const postToEdit = state.posts.find((post) => post.id === postId);
      state.postToUpdate = postToEdit;
    },
    setPostIsEditable(state, payload) {
      state.postIsEditable = payload;
    },
    setForums(state, querySnapshot) {
      let forums = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const forum = {
          id: doc.id,
          ...doc.data(),
        };
        forums.push(forum);
      });
      state.forums = forums;
    },
    setThreads(state, querySnapshot) {
      let threads = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const thread = {
          id: doc.id,
          ...doc.data(),
        };
        threads.push(thread);
      });
      state.threads = threads;
    },
    setUsers(state, querySnapshot) {
      let users = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const user = {
          id: doc.id,
          ...doc.data(),
        };
        users.push(user);
      });
      state.users = users;
    },
    setPost(state, post) {
      state.posts.push(post);
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts.push(postId);
    },
    removePost(state, postId) {
      state.posts = removeObjectWithId(state.posts, postId);
    },
    removeThread(state, threadId) {
      state.posts = removeObjectWithId(state.threads, threadId);
    },
  },
  actions: {
    // Firebase Authentication
    async signup(context, payload) {
      console.log("signup action");
      const { name, username, email, password } = payload;
      const resAuth = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(resAuth.user.uid);
      const resDoc = await setDoc(doc(db, "users", resAuth.user.uid), {
        name: name,
        username: username,
        email: email,
        avatar: null,
        bio: "",
        isModerator: null,
        lastVisit: null,
        postsCount: 0,
        registeredAt: Math.floor(Date.now() / 1000),
        threads: [],
        twitter: null,
        website: null,
      });
      if (resAuth) {
        const docUser = doc(db, "users", resAuth.user.uid);
        const docSnap = await getDoc(docUser);
        if (docSnap.exists()) {
          const currentUser = {
            id: resAuth.user.uid,
            ...docSnap.data(),
          };
          context.commit("setAuthUser", currentUser);
        }
      } else {
        throw new Error("Could not complete signup");
      }
    },
    async login(context, payload) {
      console.log("login action");
      const { email, password } = payload;
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res) {
        console.log(res.user.uid);
        const docUser = doc(db, "users", res.user.uid);
        const docSnap = await getDoc(docUser);
        if (docSnap.exists()) {
          const currentUser = { id: res.user.uid, ...docSnap.data() };
          context.commit("setAuthUser", currentUser);
          console.log("docSnap", docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        throw new Error("Could not complete login");
      }
    },
    async updateUser(context, {user}) {
      // update authUser state
      context.commit("setAuthUser", user)
      // update authUser data in firebase
      const userDoc = doc(db, "users", user.id)
      await updateDoc(userDoc, {...user})
    },
    async logout({ commit }) {
      console.log("logout action");
      await signOut(auth);
      commit("setAuthUser", null);
    },
    async createPost(context, post) {
      const addPost = await addDoc(collection(db, "posts"), post);
      const postThreadRef = doc(db, "threads", post.threadId);
      await updateDoc(postThreadRef, {
        posts: arrayUnion(addPost.id),
      });
      const postDoc = doc(db, "posts", addPost.id);
      const postData = await getDoc(postDoc);
      const newPost = {
        id: addPost.id,
        ...postData,
      };
      context.commit("setPost", newPost);
    },
    async removePost(context, { userId, postId, threadId }) {
      context.commit("removePost", postId);

      const threadDoc = doc(db, "threads", threadId);
      const threadData = await getDoc(threadDoc);
      await updateDoc(threadDoc, {
        posts: threadData.data().posts.filter((item) => item !== postId),
      });
      const deletePostDoc = await deleteDoc(doc(db, "posts", postId));
      if (deletePostDoc) {
        console.log("Post was deleted");
      } else {
        console.log("Post was not deleted");
      }
    },
    async removeThread(
      context,
      { authUserId, threadId, forumId, threadPosts }
    ) {
      context.commit("removeThread", threadId);
      // remove all post of the current thread
      if (threadPosts) {
        threadPosts.forEach(async (postId) => {
          const deleteThreadPost = await deleteDoc(doc(db, "posts", postId));
        });
      }
      // remove thread from firebase
      const deleteThread = await deleteDoc(doc(db, "threads", threadId));
      if (deleteThread) {
        console.log("Thread was deleted");
      } else {
        console.log("Thread was not deleted");
      }
      // remove thread from user document
      const userDoc = doc(db, "users", authUserId);
      const userData = await getDoc(userDoc);
      await updateDoc(userDoc, {
        threads: userData.data().threads.filter((item) => item !== threadId),
        postsCount:
          context.state.authUser.postsCount -
          userData.data().posts.filter((post) => post.threadId === threadId)
            .length,
      });
      context.commit("setUserPostsCount");
      // remove thread from forum
      const forumDoc = doc(db, "forums", forumId);
      const forumData = await getDoc(forumDoc);
      await updateDoc(forumDoc, {
        threads: forumData.data().threads.filter((item) => item !== threadId),
      });
    },

    setEditPost(context, postId) {
      context.commit("setEditPost", postId);
      context.commit("setPostIsEditable", true);
    },
    async updatePost(context, { postId, postText }) {
      const postDoc = doc(db, "posts", postId);
      await updateDoc(postDoc, {
        text: postText,
      });
      context.commit("setPostIsEditable", false);
    },
    async addThread(context, newThread) {
      const addNewThread = await addDoc(collection(db, "threads"), newThread);

      const forumDoc = doc(db, "forums", newThread.forumId);
      const userDoc = doc(db, "users", newThread.userId);

      await updateDoc(forumDoc, {
        threads: arrayUnion(addNewThread.id),
      });
      await updateDoc(userDoc, {
        threads: arrayUnion(addNewThread.id),
      });

      router.push({ name: "Forum", params: { id: newThread.forumId } });
    },
    async updateThread(context, { threadId, newThreadText }) {
      const threadDoc = doc(db, "threads", threadId);
      await updateDoc(threadDoc, {
        title: newThreadText,
      });
    },
  },
  getters: {
    authUserPosts(state) {
      const userPosts = state.posts
        .filter((post) => post.userId === state.authUser?.id)
        .sort((p1, p2) =>
          p1.publishedAt < p2.publishedAt
            ? 1
            : p1.publishedAt > p2.publishedAt
            ? -1
            : 0
        );
      return userPosts;
    },
    authUserThreads(state) {
      const userThreads = state.threads
        .filter((thread) => thread.userId === state.authUser?.id)
        .sort((t1, t2) =>
          t1.publishedAt < t2.publishedAt
            ? 1
            : t1.publishedAt > t2.publishedAt
            ? -1
            : 0
        );
      return userThreads;
    },
  },
  modules: {},
});

const unsubscribe = onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docUser = doc(db, "users", user.uid);
    const docSnap = await getDoc(docUser);
    const currentUser = { id: user.uid, ...docSnap.data() };
    if (docSnap.exists()) {
      store.commit("setAuthUser", currentUser);
      store.commit("setAuthIsReady", true);
      if(router.isReady() && (router.currentRoute.value.path === "/login" || router.currentRoute.value.path === "/signup" )){
        router.push("/");
      }
    } else {
      console.log("No user found");
      store.commit("setAuthIsReady", false);
     
    }
    // subscribe only at first time
    unsubscribe();
  }
});

function removeObjectWithId(arr, id) {
  const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
  arr.splice(objWithIdIndex, 1);

  return arr;
}

// add data to firebase
// const addData = () => {
//   data.stats.forEach(async (item) => {
//     await setDoc(doc(db, "stats", item.id), item);
//   });
// };
// addData();

export default store;
