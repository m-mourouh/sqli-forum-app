<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :categoryId="category.id"
  />
</template>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { useStore } from "vuex";
import ForumList from "./ForumList";
export default {
  components: {
    ForumList,
  },
  // composition api
  setup() {
    // store
    const store = useStore();
    // state
    const categories = ref(null);
    const forums = ref(null);
    // computed properties
    const getCategories = computed(() => store.state.categories);
    const getForums = computed(() => store.state.categories);
    // lifecycle hooks
    onMounted(() => {
      // Get realtime updates
      onSnapshot(collection(db, "categories"), (querySnapshot) => {
        store.commit("setCategories", querySnapshot);
        categories.value = getCategories.value;
      });
      onSnapshot(collection(db, "forums"), (querySnapshot) => {
        store.commit("setForums", querySnapshot);
        forums.value = getForums.value;
      });
    });
    // methods
    const getForumsForCategory = (category) =>
      store.state.forums.filter((forum) => forum.categoryId === category.id);

    return { getForumsForCategory, categories };
  },
};
</script>
