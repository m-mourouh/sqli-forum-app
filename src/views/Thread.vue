<template>
  <div class="col-large push-top" v-if="thread">
    <h1>{{ thread.title }}</h1>
    <PostList :posts="threadPosts"  />
    <div v-if="authIsReady">
    <PostEditor :authUser="authUser" @save="addPost" />
    </div>
    <div v-else class="col-full text-center">
      <router-link :to="{name: 'Login'}" class="btn btn-primary mb-5 mt-5">React to this thread</router-link>
    </div>
  </div>
  <div v-else class="col-full text-center">No Thread found</div>
</template>

<script>
import PostList from "../components/PostList.vue";
import PostEditor from "../components/PostEditor.vue";
import { computed, ref, onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import { db } from "../firebase/config.js";
import { collection, onSnapshot } from "firebase/firestore";
export default {
  components: {
    PostEditor,
    PostList,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  // composition api
  setup(props) {
    // store
    const store = useStore();
    // local state
    const newPostText = ref("");
    // computed properties
    const thread = computed(() =>
      store.state.threads.find((thread) => thread.id === props.id)
    );
    const threadPosts = computed(() =>
      store.state.posts.filter((p) => p.threadId === props.id)
    );
    const posts = computed(() => store.state.posts);
    const users = computed(() => store.state.users);
    const threads = computed(() => store.state.threads);
    const authUser = computed(() => store.state.authUser);
    const authIsReady = computed(() => store.state.authIsReady);

    onMounted(() => {
      onSnapshot(collection(db, "threads"), (querySnapshot) => {
        store.commit("setThreads", querySnapshot);
      });
      onSnapshot(collection(db, "posts"), (querySnapshot) => {
        store.commit("setPosts", querySnapshot);
      });
    });
    // methods
    const addPost = ({ post }) => {
      post.threadId = props.id;
      store.dispatch("createPost", post);
    };

    return { newPostText, thread, threadPosts, posts, users, threads, addPost, authUser,authIsReady };
  },
};
</script>

<style></style>
