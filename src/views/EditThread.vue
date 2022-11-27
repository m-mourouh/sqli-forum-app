<template>
  <div class="container">
    <h1 class="text-center mt-5">Edit new thread</h1>
    <form class="mt-5" @submit.prevent="editThread">
      <div class="form-group">
        <label for="threadTitle">Thread Title</label>
        <input
          v-model="threadTitle"
          type="text"
          class="form-control"
          id="threadTitle"
          aria-describedby="thread title"
          placeholder="Enter your thread title"
        />
      </div>
      <button type="submit" class="btn btn-green btn-small">Update Thread</button>
    </form>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { computed, onMounted } from "@vue/runtime-core";
import router from '@/router';
export default {
  props: {
    id: {
      type: String,
      required: true,
      },
    forumId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // store
    const store = useStore();
    // refs
    const threadTitle = ref("");
    const threads = computed(() => store.state.threads);
    // methods
    const editThread = () => {
      if (threadTitle.value.trim()) {
        const newThreadText = threadTitle.value;
        const threadId = props.id;
        store.dispatch("updateThread", { threadId, newThreadText });
        router.push({name: "Forum", params: {id: props.forumId}})
      } else {
        alert("Thread title cannot be empty");
      }
    };
    onMounted(() => {
      threadTitle.value = threads.value.find((t) => t.id === props.id).title;
      console.log(threadTitle.value);
    });
    return { editThread, threadTitle };
  },
};
</script>

<style></style>
