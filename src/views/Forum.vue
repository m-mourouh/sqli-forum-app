<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link :to="{name: 'NewThread', params:{id: id }}" class="btn btn-green btn-small">Start new Thread</router-link>
    </div>
  </div>
  <div class="col-full push-top">
        <ThreadList :threads="threads" />
    </div>
</template>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import ThreadList from "../components/ThreadList";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config.js";
export default {
  components: {
    ThreadList,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  // composition api
  setup(props) {
    // store
    const store = useStore();
    const forum = ref({});
    // computed properties
    const getForum = computed(() =>
      store.state.forums.find((f) => f.id === props.id)
    );
    const threads = computed(() =>
      store.state.threads.filter((thread) => thread.forumId === props.id)
    );
    const authIsReady = computed(() => store.state.authIsReady);
    onMounted(() => {
      onSnapshot(collection(db, "forums"), (querySnapshot) => {
        store.commit("setForums", querySnapshot);
        forum.value = getForum.value;
        // console.log("forum",forum.value.name)
      });
       onSnapshot(collection(db, "threads"), (querySnapshot) => {
        store.commit("setThreads", querySnapshot);
      });
   
    });

    return { forum, threads, authIsReady};
  },
};
</script>

<style></style>
