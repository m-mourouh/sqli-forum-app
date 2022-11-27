<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <h1 class="h1 p-3">{{ category.name }}</h1>
  <ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>

<script>
import { computed } from "@vue/runtime-core";
import ForumList from "../components/ForumList";
import { useStore } from "vuex";
export default {
  components: {
    ForumList,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
//   composition api
  setup(props) {
    // store
    const store = useStore();
    // computed properties
    const category = computed(() =>
      store.state.categories.find((category) => category.id === props.id)
    );
    // methods
    const getForumsForCategory = (category) =>
      store.state.forums.filter((forum) => forum.categoryId === category.id);

    return { category, getForumsForCategory };
  },

};
</script>


