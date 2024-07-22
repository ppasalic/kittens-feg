<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
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

    const onSubmit = () => {
      authStore.setUsername(username.value);
      authStore.setPassword(password.value);

      if (authStore.authenticate()) {
        router.push({ name: 'Home' });
        // Redirect to a protected route or show success message
        console.log('Login successful');
      } else {
        error.value = 'Invalid username or password';
      }
    };

    return {
      username,
      password,
      error,
      onSubmit
    };
  }
});
</script>
