<template>
  <div class="container">
    <section class="h-100">
      <div class="container h-100">
        <div class="row justify-content-md-center h-100">
          <div class="card-wrapper">
            <div class="card fat">
              <div class="card-body">
                <h4 class="card-title">Reset Password</h4>
                <form
                  class="my-login-validation"
                  @submit.prevent="resetPassword"
                >
                  <div class="form-group">
                    <label for="email" class="mb-3"
                      >Enter your email to reset your password</label
                    >
                    <br />
                    <input
                      id="email"
                      type="email"
                      class="form-control"
                      name="email"
                      required
                      placeholder="Email"
                      v-model="email"
                    />
                    <div class="invalid-feedback">Email is invalid</div>
                  </div>
                  <div class="form-group m-0">
                    <button type="submit" class="btn btn-green btn-small btn-block">
                      Reset
                    </button>
                  </div>
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
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const email = ref("");
    const resetPassword = () => {
      store.dispatch("resetPassword", email.value);
      email.value = "";
    };
    return { email, resetPassword };
  },
};
</script>
