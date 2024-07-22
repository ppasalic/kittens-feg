<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleOnClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Kitten info</h2>
        <button class="modal-close" @click="handleOnClose">&times;</button>
      </div>
      <h3>Name: {{ selectedKitten?.name }}</h3>
      <p>Color: {{ selectedKitten?.color }}</p>
      <p>Age: {{ selectedKitten?.age }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import type { Kitten } from '../views/HomeView.vue';

export default defineComponent({
  name: 'KittenCarouselModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    selectedKitten: {
      type: Object as PropType<Kitten | null>,
      required: true
    }
  },

  setup(props, { emit }) {
    const handleOnClose = () => {
      emit('close');
    };

    return {
      handleOnClose
    };
  }
});
</script>
<style lang="scss">
@import '@assets/scss/kittenCarouselModal.scss';
</style>
