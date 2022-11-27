<template>
  <div class="profile-card">
    <p class="text-center mb-5" v-if="authUser?.avatar" >
      <img :src="authUser?.avatar" alt="`${user.name}` profile picture"  class="user-profile-card-photo"/>
    </p>
    <p class="text-center mb-5" v-else>
      <img
        src="../assets/images/default.jpg"
        alt="`${user.name}` profile picture"
        class="rounded-circle mb-3" style="width: 150px;"
      />
    </p>
    <h1 class="title">{{ authUser?.username }}</h1>
    <p class="text-lead">{{ authUser?.name }}</p>
    <p class="text-justify">{{ authUser?.bio || "no specified user bio" }}</p>
    <span class="online">{{ authUser?.username }} is online</span>
    <div class="stats">
      <span>{{ userPostsCount }} posts</span>
      <span>{{ userThreadsCount }} threads</span>
    </div>
    <hr />
    <p class="text-large text-center">
      <i class="fa fa-globe"></i>
      <a :href="authUser?.website">{{ authUser?.website }}</a>
    </p>
  </div>
</template>

<script>
import { onMounted, computed } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
  // composition api
  setup(props) {
    const store = useStore();
    const authUser = computed(() => store.state.authUser);
    const userPosts = computed(() => store.getters.authUserPosts);
    const userThreads = computed(() => store.getters.authUserThreads);
    const userPostsCount = computed(() => userPosts.value.length);
    const userThreadsCount = computed(() => userThreads.value.length);
    return { authUser,userPostsCount, userThreadsCount };
  },
};
</script>

<style>
.user-profile-card-photo {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
