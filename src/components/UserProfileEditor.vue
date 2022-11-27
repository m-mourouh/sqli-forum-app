<template>
  <div class="profile-card" v-if="activeUser">
    <form @submit.prevent="save">
      <p class="text-center my-4">
        <label class="form-label avatar-wrapper" for="customFile">
          <img
            :src="activeUser.avatar"
            :alt="`${activeUser.name} profile picture`"
            class="avatar-xlarge img-update"
            ref="img"
          />
          <div class="avatar-overlay"><i class="fa-regular fa-image"></i></div>
        </label>
        <input
          type="file"
          class="form-control d-none"
          id="customFile"
          @change="setFile($event)"
        />
      </p>
      <div class="form-group">
        <input
          type="text"
          v-model="activeUser.username"
          placeholder="userName"
          class="form-input text-lead text-bold"
        />
      </div>
      <div class="form-group">
        <input
          type="text"
          v-model="activeUser.name"
          placeholder="full name"
          class="form-input text-lead"
        />
      </div>
      <div class="form-group">
        <label for="user_bio" class="form-label">Bio</label>
        <textarea
          v-model="activeUser.bio"
          placeholder="write a few words about yourself."
          id="user_bio"
          cols="30"
          rows="10"
          class="form-input"
        ></textarea>
      </div>
      <hr />
      <div class="form-group">
        <label for="website" class="form-label">Website</label>
        <input
          type="text"
          id="website"
          autocomplete="off"
          v-model="activeUser.website"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          type="text"
          id="email"
          autocomplete="off"
          v-model="activeUser.email"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label for="Location" class="form-label">Location</label>
        <input
          type="text"
          id="Location"
          autocomplete="off"
          v-model="activeUser.location"
          class="form-input"
        />
      </div>
      <div class="btn-group space-between">
        <button class="btn-ghost" @click="hideProfileEditor">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>
</template>
<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { storage } from "../firebase/config.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  // composition api
  setup(props, { emit }) {
    const imageFile = ref(null);
    const img = ref(null);
    // upload
    const setFile = (event) => {
      if (event.target.files.length > 0) {
        imageFile.value = event.target.files[0];
        const url = URL.createObjectURL(imageFile.value);
        img.value.src = url;
      }
    };
    // store
    const store = useStore();
    // local state
    const activeUser = ref(props.user);
  
    // methods
    const save = () => {
      if (imageFile.value !== null){
        const imgRef = storageRef(storage, `avatars/${activeUser.value.id}`);
        uploadBytes(imgRef, imageFile.value);
        getDownloadURL(imgRef)
          .then((url) => {
            const newUserData = {...activeUser.value, avatar: url}
            activeUser.value = newUserData
            store.dispatch("updateUser", { user: newUserData });
            alert("Your profile was updated")
          })
          .catch((error) => {
            // Handle any errors
            console.log(error);
          });

      }else{
        store.dispatch("updateUser", { user: activeUser.value });
        alert("Your profile was updated")
      }
    };
    const hideProfileEditor = () => {
      emit("hide");
    };
    
    return { activeUser, save, hideProfileEditor, setFile, img };
  },
};
</script>
<style>
.avatar-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}
.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: none;
  justify-content: center;
  align-items: center;
  color: rgb(218, 218, 218);
  font-size: 30px;
  transition: 0.2s ease-in-out;
  cursor: pointer;
}
.avatar-wrapper:hover .avatar-overlay {
  display: flex;
}
</style>
