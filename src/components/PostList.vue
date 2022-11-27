<template>
  <div class="post-list">
    <template v-if="showPostActions">
      <div v-for="post in posts" :key="post.id" class="post">
        <Post :show="true" :post="post" />
      </div>
    </template>
    <template v-else>
        <div v-for="post in posts" :key="post.id" class="post">
      <router-link :to="{ name: 'ThreadShow', params: { id: post.threadId } }">
          <Post :show="false" :post="post" />
      </router-link>
        </div>
    </template>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { onMounted, ref } from "@vue/runtime-core";
import Post from "./Post";
export default {
  components: {
    Post,
  },
  props: {
    posts: {
      required: true,
      posts: Array,
    },
  },
  //   composition api
  setup() {
    // router
    const router = useRouter();
    // refs
    const showPostActions = ref(true);
    onMounted(() => {
      if (router.currentRoute.value.name === "Profile")
        showPostActions.value = false;
    });
    return { showPostActions };
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
