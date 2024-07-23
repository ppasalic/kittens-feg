<template>
  <div class="card" style="cursor: pointer">
    <div class="card-image">
      <img class="kitten-img bg-white" style="display: block" :src="kitten.image" alt="Kitten" />
    </div>
    <div class="card-description">
      <h1>Name: {{ kitten.name }}</h1>
      <p>Age: {{ kitten.age }}</p>
      <p>Color: {{ kitten.color }}</p>
      <div class="edit-delete-controls">
        <button @click="$emit('edit', kitten)">
          <span class="edit-icon"><PencilSquareIcon class="icon" /></span>
        </button>
        <button @click="$emit('delete', kitten)">
          <span class="delete-icon"><TrashIcon class="icon" /></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import type { Kitten } from '../views/HomeView.vue';

export default defineComponent({
  components: {
    PencilSquareIcon,
    TrashIcon
  },
  props: {
    kitten: {
      type: Object as PropType<Kitten>,
      required: true
    }
  }
});
</script>

<style lang="scss">
@import '@assets/scss/kittenCard.scss';
</style>
