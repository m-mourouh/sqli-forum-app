<template v-if="thread">
        <div>
          <!-- <p><router-link :to="`/thread/${thread.id}`">{{thread.title}}</router-link></p> -->
          <p>
            <router-link
              :to="{ name: 'ThreadShow', params: { id: thread.id } }"
              >{{ thread.title }}</router-link
            >
          </p>
          <p class="text-faded text-xsmall">
            By <a>{{ userById(thread.userId)?.name }}</a> ,
            <app-date :timeStamp="thread?.publishedAt" />
          </p>
        </div>
        <div class="activity">
          <p class="replies-count">{{ thread.posts.length }}</p>
          <img
            :src="userById(thread.userId)?.avatar"
            alt=""
            class="avatar-medium"
          />
          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId)?.name }}</a>
            </p>
            <div class="text-faded text-xsmall">
              <app-date :timeStamp="thread?.publishedAt" />
            </div>
          </div>
          <div
            class="thread-user-actions"
            v-if="thread?.userId === authUser?.id && show"
          >
            <router-link
              :to="{ name: 'EditThread', params: { forumId: thread?.forumId ,id: thread?.id } }"
            >
              <button title="Edit your thread">
                <Icon icon="mdi:pencil" />
              </button>
            </router-link>
            <button
              @click="
                removeThread(
                  authUser?.id,
                  thread.id,
                  thread.forumId,
                  thread?.posts
                )
              "
              title="Delete  your thread"
            >
              <Icon icon="mdi:trash-can-outline" />
            </button>
          </div>
        </div>

</template>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { collection, onSnapshot} from "firebase/firestore";
import { db } from "../firebase/config.js";
import { Icon } from "@iconify/vue";
import { useRouter } from 'vue-router';
export default {
  props: {
    thread: {
      type: Object,
      required: true,
    },
    show: {
        type: Boolean,
        required: true
    }
  },
  components: {
    Icon,
  },
  // composition api
  setup() {

    // store
    const store = useStore();
    // computed properties
    const users = computed(() => store.state.users);
    const posts = computed(() => store.state.posts);
    const authUser = computed(() => store.state.authUser);

    // methods
    const postById = (postId) => posts.value.find((post) => post.id === postId);
    const userById = (userId) => users.value.find((user) => user.id === userId);
    const removeThread = (authUserId, threadId, forumId, threadPosts) => {
      store.dispatch("removeThread", {
        authUserId,
        threadId,
        forumId,
        threadPosts,
      });
    };
    onMounted(() => {
      onSnapshot(collection(db, "posts"), (querySnapshot) => {
        store.commit("setPosts", querySnapshot);
      });

      onSnapshot(collection(db, "users"), (querySnapshot) => {
        store.commit("setUsers", querySnapshot);
      });
    });
    return { users, posts, userById, postById, authUser, removeThread };
  },
};
</script>

<style>
.thread-user-actions {
  transition: 0.25s ease-in-out;
  display: none;
  padding: 5px 10px;
  margin-left: 20px;
}
.thread:hover .thread-user-actions {
  display: flex;
}
</style>
