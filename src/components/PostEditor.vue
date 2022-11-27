<template>
  <div class="col-ful">
    <template v-if="postIsEditable">
     <EditPost @edit="updatePost"/>
    </template>
    <template v-else>
      <form @submit.prevent="save">
        <div class="form-group">
          <textarea
            v-model="text"
            name=""
            id=""
            cols="30"
            rows="10"
            class="form-input"
            placeholder="Write something..."
            minlength="1"
          ></textarea>
        </div>
        <div class="form-actions">
          <button class="btn-blue">Add Post</button>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import EditPost from "./EditPost.vue"
export default {
  props: ["authUser"],
  components: {
    EditPost
  },
  // composition api
  setup(props, { emit }) {
    const store = useStore();
    // local state
    const text = ref("");
    // computed properties
    const postIsEditable = computed(() => store.state.postIsEditable);

    // methods
    const save = () => {
      if(text.value.trim()){
        const post = {
          editedAt: {
            at: null,
            by: null,
            moderated: null,
          },
          text: text.value,
          publishedAt: Math.floor(Date.now() / 1000),
          userId: props.authUser.id,
        };
        text.value = "";
        //  emit
        emit("save", { post });
      }else {
        alert('Post cannot be empty')
      }
    };
    const updatePost = ({postId, postText}) => {
        store.dispatch("updatePost", {postId, postText})

    }
    return { text, save, postIsEditable, updatePost };
  },
};
</script>

<style></style>
