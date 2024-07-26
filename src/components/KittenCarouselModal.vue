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
      <button button @click="$emit('adopt', selectedKitten)" class="adopt-kitten-btn">
        <span>Adopt</span>
        <span class="heart-icon"><HeartIcon /></span>
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { HeartIcon } from '@heroicons/vue/24/solid';
import type Kitten from '../types/Kitten';

export default defineComponent({
  name: 'KittenCarouselModal',
  components: {
    HeartIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    selectedKitten: {
      type: Object as PropType<Kitten>,
      required: true,

      default: () => ({
        id: 0,
        name: '',
        color: '',
        age: '',
        image: ''
      })
    }
  },

  setup(__, { emit }) {
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
