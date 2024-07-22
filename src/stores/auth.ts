// src/stores/authStore.ts
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    username: '',
    password: ''
  }),
  actions: {
    setUsername(username: string) {
      this.username = username;
    },
    setPassword(password: string) {
      this.password = password;
    },
    authenticate() {
      if (this.username === 'admin' && this.password === 'admin') {
        return true;
      } else {
        return false;
      }
    }
  }
});
