<template>
  <div class="user-info">
    <a href="#" class="user-name">{{ userById(post.userId)?.name }}</a>
    <a href="#">
      <template v-if="userById(post.userId)?.avatar">
        <img
          :src="userById(post.userId).avatar"
          alt="user avatar"
          class="avatar-large"
        />
      </template>
      <template v-else>
        <img 
          src="../assets/images/default.jpg"
          alt="user photo"
          class="avatar-large"
        />
      </template>
    </a>
    <p class="desktop-only text-small">
      {{ userPostsCount }} posts
    </p>
  </div>
  <div class="post-content">
    <div>
      <p>{{ post.text }}</p>
    </div>
  </div>
  <div class="post-date text-faded">
    <app-date :time-stamp="post.publishedAt" />
  </div>
  <div class="user-actions" v-if="post.userId === authUser?.id && show">
    <button @click="editPost(post.id)" title="Edit your post">
      <Icon icon="mdi:pencil" />
    </button>
    <button
      @click="removePost(authUser?.id, post.id, post.threadId)"
      title="Delete  your post"
    >
      <Icon icon="mdi:trash-can-outline" />
    </button>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, onMounted, ref } from "@vue/runtime-core";
import { db } from "../firebase/config.js";
import { collection, onSnapshot } from "firebase/firestore";
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
  },
  props: {
    post: {
      required: true,
      type: Object,
    },
    show: {
      required: true,
      type: Boolean,
    },
  },
  //   composition api
  setup() {
    // store
    const store = useStore();

    // computed properties
    const users = computed(() => store.state.users);
    const authUser = computed(() => store.state.authUser);
    const userPosts = computed(() => store.getters.authUserPosts);
    const userPostsCount = computed(() => userPosts.value.length);
    // methods
    const userById = (userId) => users.value.find((user) => user.id === userId);
    const removePost = (userId, postId, threadId) => {
      store.dispatch("removePost", { userId, postId, threadId });
    };
    const editPost = (postId) => {
      store.dispatch("setEditPost", postId);
    };
    onMounted(() => {
      onSnapshot(collection(db, "users"), (querySnapshot) => {
        store.commit("setUsers", querySnapshot);
      });
    });
    return { userById, authUser, removePost, editPost, userPostsCount };
  },
};
</script>

<style>
.user-actions {
  position: absolute;
  right: 20px;
  top: 20px;
}

.post-list .post {
  position: relative;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 20px 10px;
}
.post-list .post:hover {
  background: #edf1fb;
}
.user-actions {
  display: none;
}
.post-list .post:hover .user-actions {
  display: flex;
}
</style>
