<template>
  <AppHeader />
  <router-view></router-view>
</template>

<script lang="ts">
import AppHeader from '../components/AppHeader.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseLayout',
  components: {
    AppHeader
  }
});
</script>
