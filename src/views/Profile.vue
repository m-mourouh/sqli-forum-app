<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="flex-container">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <!-- Profile Card -->
        <UserProfileCard />
        <!-- user profile editor -->
        <template v-if="editProfile">
          <UserProfileEditor :user="authUser" @hide="hideEditor" />
        </template>
        <p class="text-small text-faded text-center">
          Member since <AppDate :timeStamp="authUser?.registeredAt" />
        </p>
        <div class="text-center">
          <hr />
          <button v-if="!editProfile" class="btn-green btn-small" @click="showEditor">
            Edit Profile
          </button>
        </div>

      </div>
      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead">{{ authUser?.name }} recent activity</span>
          <a href="#" v-if="show" @click="toggleShow">See only threads?</a>
          <a href="#" v-else @click="toggleShow">See only posts?</a>
        </div>
        <hr />
        <template v-if="show">
          <div v-if="userPosts.length > 0">
            <PostList :posts="userPosts" />
          </div>
          <div class="text-center" v-else>You have no posts</div>
        </template>
        <template v-else>
          <div v-if="userThreads.length > 0">
            <ThreadList :threads="userThreads" />
          </div>
          <div class="text-center" v-else>You have no threads</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AppDate from "../components/AppDate";
import PostList from "../components/PostList";
import ThreadList from "../components/ThreadList";
import UserProfileCard from "../components/UserProfileCard";
import { useStore } from "vuex";
import UserProfileEditor from "../components/UserProfileEditor";
import { computed, onMounted, ref } from "@vue/runtime-core";
import { db } from "../firebase/config.js";
import { collection, onSnapshot } from "firebase/firestore";
export default {
  components: {
    PostList,
    UserProfileCard,
    UserProfileEditor,
    AppDate,
    ThreadList,
  },
  // composition api
  setup() {
    // refs
    const show = ref(true);
    const editProfile = ref(false);
    // store
    const store = useStore();
    // computed properties
    // refs

    const authUser = computed(() => store.state.authUser);
    const userPosts = computed(() => store.getters.authUserPosts);
    const userThreads = computed(() => store.getters.authUserThreads);

    // methods
    const toggleShow = () => {
      show.value = !show.value;
    };
    const hideEditor = () => {
      editProfile.value = false;
    }
    const showEditor = () => {
      editProfile.value = true;
    };
    onMounted(() => {
      onSnapshot(collection(db, "posts"), (querySnapshot) => {
        store.commit("setPosts", querySnapshot);
      });
      onSnapshot(collection(db, "threads"), (querySnapshot) => {
        store.commit("setThreads", querySnapshot);
      });
      onSnapshot(collection(db, "users"), (querySnapshot) => {
        store.commit("setUsers", querySnapshot);
      });
    });

    return {
      authUser,
      userPosts,
      userThreads,
      show,
      toggleShow,
      editProfile,
      showEditor,
      hideEditor
    };
  },
};
</script>
