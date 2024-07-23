<template>
  <div class="card" style="cursor: pointer">
    <div class="card-image">
      <img class="kitten-img" :src="kitten.image" alt="Kitten" />
    </div>
    <div class="card-description">
      <h1>Name: {{ kitten.name }}</h1>
      <p>Age: {{ kitten.age }}</p>
      <p>Color: {{ kitten.color }}</p>
      <div class="edit-delete-controls">
        <button @click="$emit('edit', kitten)" class="edit-delete-kitten">
          <span class="edit-icon"><PencilSquareIcon class="icon" /></span>
        </button>
        <button @click="$emit('delete', kitten)" class="edit-delete-kitten">
          <span class="delete-icon"><TrashIcon class="icon" /></span>
        </button>
      </div>
    </div>
    <div class="card-footer">
      <button button @click="$emit('adopt', kitten.id)" id="adopt-kitten-btn">
        <span>Adopt</span>
        <span class="heart-icon"><HeartIcon /></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { PencilSquareIcon, TrashIcon, HeartIcon } from '@heroicons/vue/24/solid';
import type { Kitten } from '../views/HomeView.vue';

export default defineComponent({
  components: {
    PencilSquareIcon,
    TrashIcon,
    HeartIcon
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
