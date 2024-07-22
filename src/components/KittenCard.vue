<template>
  <div class="card" style="cursor: pointer">
    <div class="card-image">
      <img class="kitten-img bg-white" style="display: block" :src="kitten.image" alt="Kitten" />
    </div>
    <div class="card-description">
      <h1>Name: {{ kitten.name }}</h1>
      <p>Age: {{ kitten.age }}</p>
      <p>Color: {{ kitten.color }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface Kitten {
  id: number;
  name: string;
  color: string;
  age: string;
  image?: string;
}

export default defineComponent({
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
