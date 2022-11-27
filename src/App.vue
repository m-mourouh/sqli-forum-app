<template>
  <NavBar />
  <div class="contain">
    <router-view />
  </div>
</template>

<script>
import { onMounted, computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
  setup() {
    const store = useStore();
  },
};
</script>

<style>
@import "./assets/css/style.css";
</style>
