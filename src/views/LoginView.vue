<template>
  <div class="login-page">
    <div class="form">
      <h2>Login</h2>

      <VeeForm class="login-form" @submit="onSubmit" :validation-schema="loginSchema">
        <div class="form-group">
          <label for="username">Username</label>
          <VeeField
            type="text"
            :bails="false"
            name="username"
            :rules="loginSchema.username"
            placeholder="Enter username"
          />
          <ErrorMessage class="error-message" name="username" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <VeeField
            type="password"
            :bails="false"
            id="password"
            name="password"
            :rules="loginSchema.password"
            placeholder="Enter password"
          />
          <ErrorMessage class="error-message" name="password" />
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button type="submit">Login</button>
      </VeeForm>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
export default defineComponent({
  data() {
    return {
      loginSchema: {
        username: 'required|min:5|max:50|alpha_spaces',
        password: 'required|min:5|max:50|alpha_spaces'
      }
    };
  },
  computed: {
    ...mapStores(useAuthStore)
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const errorMessage = ref<string>('');
    const formIsValid = ref<boolean>(false);

    const onSubmit = (values) => {
      const { username, password } = values;
      formIsValid.value = true;

      console.log(values);

      authStore.setUsername(username);
      authStore.setPassword(password);

      if (authStore.authenticate()) {
        router.push({ name: 'Home' });
      } else {
        errorMessage.value = 'Invalid username or password';
      }
    };

    return {
      formIsValid,
      errorMessage,
      onSubmit
    };
  }
});
</script>
<style lang="scss">
@import '@assets/scss/loginView.scss';
</style>
