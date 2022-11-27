<template>
  <header class="header" id="header">
    <div class="btn-hamburger">
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>
    <nav class="navbar">
        <!-- fo all users -->
        <li>
          <router-link class="logo" :to="{ name: 'Home' }">
            <img src="../assets/images/logo.png" alt="logo"  class="logo"/>
          </router-link>
        </li>
      <template v-if="authIsReady">
        <!-- for logged in users -->
        <div v-if="authUser">
          <router-link :to="{ name: 'Profile' }">
            <template v-if="authUser.avatar">
            <img
              :src="authUser.avatar"
              alt="user"
              class="avatar-small"
            />
            </template>
            <template v-else>
            <img
              src="../assets/images/default.jpg"
              alt="user"
              class="avatar-small"
            />
            </template>
            <span>{{authUser.username}}</span>
          </router-link>
          <span class="toggleMenu" @click="toggleMenu">
            <Icon icon="ic:baseline-keyboard-arrow-down"
          /></span>
          <div id="user-dropdown" ref="menu">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item" >
                <router-link :to="{ name: 'Profile' }"
                  >View Profile</router-link
                >
              </li>
              <li class="dropdown-menu-item" @click.prevent="logout">
                <a href="#">Log out</a>
              </li>
            </ul>
          </div>
        </div>
        <!-- for logged out users -->
      </template>
        <div  class="menu-items" v-else>
          <li><router-link :to="{ name: 'Home' }">Home</router-link></li>
          <li><router-link :to="{ name: 'Login' }">Login</router-link></li>
          <li><router-link :to="{ name: 'Signup' }">Register</router-link></li>
        </div>
    </nav>
  </header>
</template>

<script>
import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { Icon } from "@iconify/vue";
import { useRouter } from "vue-router";
export default {
  components: {
    Icon,
  },
  // composition api
  setup() {
    // refs
    const menu = ref(null);
    // const toggleDropDownMenu = ref(false);
    // store
    const store = useStore();
    // router
    const router = useRouter();

    // computed properties
    const authUser = computed(() => store.state.authUser);
    const authIsReady = computed(() => store.state.authIsReady);
    // methods
    const toggleMenu = () => {
      if (!menu.value.classList.contains("active")) {
        menu.value.classList.add("active");
      } else {
        menu.value.classList.remove("active");
      }
    };
    const logout = async () => {
      await store.dispatch("logout");
      router.push({ name: "Home" });
    };
    return { authUser, menu, toggleMenu, logout, authIsReady };
  },
};
</script>

<style scoped>
#header > nav > li > span {
  display: flex;
  align-items: center;
}

#header > nav > li > span > a > span {
  margin-left: 10px;
}
.toggleMenu {
  margin-left: 5px;
}
li {
  color: #57ad8d;
  cursor: pointer;
}
.toggleMenu svg {
  color: #57ad8d;
  font-size: 1.5rem;
  cursor: pointer;
}
#user-dropdown.active {
  display: block;
}
.menu-items {
  display: flex;
  align-items: center;
}

.menu-items li {
  margin: 0 10px;
}
</style>
