<template>
<div class="container">
  <h1 class="text-center mt-5">Add new thread</h1>
<form class="mt-5" @submit.prevent="addThread">
  <div class="form-group">
    <label for="threadTitle">Thread Title</label>
    <input v-model="threadTitle" type="text" class="form-control" id="threadTitle" aria-describedby="thread title" placeholder="Enter your thread title">
  </div>
  <button type="submit" class="btn btn-green btn-small">Add Thread</button>
</form>
</div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props){
        // store
        const store = useStore()
        // refs
        const threadTitle = ref("");
        const authUserId = computed(() => store.state.authUser.id)
        // methods
        const addThread = () => {
           if(threadTitle.value.trim()){
             const newThread = {
                contributors: [],
                firstPostId: null,
                forumId: props.id,
                lastPostAt: null,
                lastPostId: null,
                posts: [],
                publishedAt: Math.floor(Date.now() / 1000),
                slug: String(threadTitle.value).toLowerCase().split(" ").join("-"),
                title:  threadTitle.value,
                userId: authUserId.value,
            }
            store.dispatch("addThread",newThread)
           }else{
            alert("Thread title cannot be empty")
           }
        }
        return {addThread, threadTitle}
    }
}
</script>

<style>

</style>