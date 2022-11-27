<template>
  <section class="h-100">
    <div class="container h-100">
      <div class="row justify-content-md-center h-100">
        <div class="card-wrapper">
          <div class="card fat">
            <div class="card-body">
              <h4 class="card-title">Register</h4>
              <form class="my-login-validation" @submit.prevent="handleSubmit">
                <div class="form-group">
                  <label for="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    class="form-control"
                    name="name"
                    required
                    autofocus
                    v-model="form.name"
                  />
                  <div class="invalid-feedback">What's your name?</div>
                </div>
                <div class="form-group">
                  <label for="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    class="form-control"
                    name="username"
                    required
                    autofocus
                    v-model="form.username"
                  />
                  <div class="invalid-feedback">What's your name?</div>
                </div>

                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    required
                    v-model="form.email"
                  />
                  <div class="invalid-feedback">Your email is invalid</div>
                </div>

                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    class="form-control"
                    name="password"
                    required
                    v-model="form.password"
                  />
                  <div class="invalid-feedback">Password is required</div>
                </div>

                <div class="form-group m-0">
                  <button type="submit" class="btn btn-green btn-small btn-block">
                    Register
                  </button>
                </div>
                <div class="mt-4 text-center">
                  Already have an account?
                  <router-link :to="{ name: 'Login' }">Login</router-link>
                </div>
                <div class="error" v-if="error"><small>{{error}}</small></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const error = ref(null)
    // store
    const store = useStore();
    // state
    const form = reactive({});
    // router
    const router = useRouter();
    // methods
    const handleSubmit = async () => {
      try {
        await store.dispatch("signup", form);
        router.push({name: "Home"})
      } catch (err) {
        error.value = err.message;
      }
    };
    return { form, handleSubmit, error };
  },
};
</script>

<style></style>
