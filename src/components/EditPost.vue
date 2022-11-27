<template>
  <form @submit.prevent="edit">
    <div class="form-group">
      <textarea
        v-model="editText"
        name=""
        id=""
        cols="30"
        rows="10"
        class="form-input"
        placeholder="update your post"
        minlength="1"
      ></textarea>
    </div>
    <div class="form-actions">
      <button class="btn-blue">Edit Post</button>
    </div>
  </form>
</template>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";

export default {
  props: ["authUser"],
  // composition api
  setup(props, { emit }) {
    const store = useStore();
    // local state
    const editText = ref("");
    // computed properties
    const postToUpdate = computed(() => store.state.postToUpdate);
    // methods
    const edit = () => {
       if(editText.value.trim()){
         const postText = editText.value;
        const postId = postToUpdate.value.id
      emit("edit",{postId,postText});
       }else {
        alert("Post cannot be empty")
       }
    };
      onMounted(() => {
      editText.value = postToUpdate.value.text
      console.log(editText.value)
    })
    return {edit, editText};
  },
};
</script>

<style></style>
