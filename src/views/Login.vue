<template>
  <div class="container">
    <section class="h-100">
      <div class="container h-100">
        <div class="row justify-content-md-center h-100">
          <div class="card-wrapper">
            <div class="card fat">
              <div class="card-body">
                <h4 class="card-title">Login</h4>
                <form  class="my-login-validation" @submit.prevent="login">
                  <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      class="form-control"
                      name="email"
                      required
                      autofocus
                      v-model="form.email"
                    />
                    <div class="invalid-feedback">Email is invalid</div>
                  </div>

                  <div class="form-group">
                    <label for="password"
                      >Password
                      <router-link
                        :to="{ name: 'ForgetPassword' }"
                        class="float-right"
                      >
                        Forgot Password?
                      </router-link>
                    </label>
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
                      Login
                    </button>
                  </div>
                  <div class="mt-4 text-center">
                    Don't have an account?
                    <router-link :to="{ name: 'Signup' }"
                      >Create One</router-link
                    >
                  </div>
                  <div v-if="error" class="error"><small>{{error}}</small></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
export default {
  setup() {
    const store = useStore();
    const form = reactive({});
    const error = ref(null);
    const router = useRouter()
    const login = async () => {
      try {
         await store.dispatch("login", form);
         router.push({name: "Home"})
      }catch(err){
        error.value = err.message;
      }

    };
    return { form, login, error };
  },
};
</script>
<style>
.error {
  color: red;
  text-align: center;
}
.card-wrapper {
  width: 400px;  
}

.card {
  border-color: transparent;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.card.fat {
  padding: 10px;
}

.card .card-title {
  margin-bottom: 30px;
}

.form-control {
  border-width: 2.3px;
}

.form-group label {
  width: 100%;
}

.btn.btn-block {
  padding: 12px 10px;
}

.float-right {
  float: right !important;
}
@media screen and (max-width: 425px) {
  .card-wrapper {
    width: 90%;
    margin: 0 auto;
  }
}

@media screen and (max-width: 320px) {
  .card.fat {
    padding: 0;
  }

  .card.fat .card-body {
    padding: 15px;
  }
}
</style>
