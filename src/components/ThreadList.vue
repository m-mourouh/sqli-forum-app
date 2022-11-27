<template>
  <div class="col-full" v-if="threads">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
        <template v-if="showThreadActions">
      <div v-for="thread in threads" :key="thread.id" class="thread">
        <Thread :thread="thread"  :show="true"/>
      </div>
    </template>
    <template v-else>
        <div v-for="thread in threads" :key="thread.id" >
      <router-link :to="{ name: 'Forum', params: { id: thread.forumId } }" class="thread">
          <Thread  :thread="thread" :show="false" />
      </router-link>
        </div>
    </template>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "@vue/runtime-core";
import Thread from "./Thread.vue"
import { useRouter } from 'vue-router';
export default {
  props: {
    threads: {
      type: Array,
      required: true,
    },
  },
  components: {
    Thread,
  },
  // composition api
  setup() {
        // router
    const router = useRouter();
    // refs
    const showThreadActions = ref(true);
  
    onMounted(() => {
            if (router.currentRoute.value.name === "Profile")
        showThreadActions.value = false;
     
    });
    return {showThreadActions};
  },
};
</script>

<style>

</style>
