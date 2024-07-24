<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">Home</router-link>
      </h1>
      <ul>
        <li v-if="isLoggedIn()">
          <a @click="logout">Logout</a>
        </li>
        <li v-else>
          <router-link to="/login">Login</router-link>
        </li>
      </ul>
    </nav>
  </header>
  <div class="page-header"><h1 class="page-title">Kitten adoption</h1></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const logout = () => {
      authStore.setUsername('');
      authStore.setPassword('');
      router.push({ name: 'Login' });
    };

    const isLoggedIn = () => {
      return authStore.authenticate();
    };

    return {
      logout,
      isLoggedIn
    };
  }
});
</script>

<style lang="scss">
@import '@assets/scss/appHeader.scss';
</style>
