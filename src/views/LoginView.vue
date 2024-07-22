<template>
  <div class="login-page">
    <div class="form">
      <h2>Login</h2>

      <form class="login-form" @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <p v-if="!formIsValid">
          Please enter a valid email and password (must be at least 6 characters long).
        </p>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  computed: {
    ...mapStores(useAuthStore)
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const username = ref<string>(authStore.username);
    const password = ref<string>(authStore.password);
    const error = ref('');
    const formIsValid = ref<boolean>(false);

    const onSubmit = () => {
      formIsValid.value = true;
      if (username.value === '' || password.value.length < 5) {
        formIsValid.value = false;
        return;
      }
      authStore.setUsername(username.value);
      authStore.setPassword(password.value);

      if (authStore.authenticate()) {
        router.push({ name: 'Home' });
      } else {
        error.value = 'Invalid username or password';
      }
    };

    return {
      username,
      password,
      error,
      formIsValid,
      onSubmit
    };
  }
});
</script>
<style lang="scss">
@import '@assets/scss/loginView.scss';
</style>
