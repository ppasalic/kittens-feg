<template>
  <div class="card" style="cursor: pointer">
    <div class="card-image">
      <img class="kitten-img bg-white" style="display: block" :src="kitten.image" alt="Kitten" />
    </div>
    <div class="card-description">
      <h1>Name: {{ kitten.name }}</h1>
      <p>Age: {{ kitten.age }}</p>
      <p>Color: {{ kitten.color }}</p>
      <button @click="openModal(kitten)">
        <PencilSquareIcon class="pencil-icon" />
      </button>
    </div>
  </div>
  <KittenEditModal
    :isOpen="isModalOpen"
    :kitten="selectedKitten"
    @close="closeModal"
    @submit="handleSubmit"
  />
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import { PencilSquareIcon } from '@heroicons/vue/24/solid';

import KittenEditModal from './KittenEditModal.vue';

interface Kitten {
  id: number;
  name: string;
  color: string;
  age: string;
  image?: string;
}

export default defineComponent({
  components: {
    KittenEditModal,
    PencilSquareIcon
  },
  props: {
    kitten: {
      type: Object as PropType<Kitten>,
      required: true
    }
  },
  setup() {
    const isModalOpen = ref(false);
    const selectedKitten = ref<Kitten>();

    const openModal = (kitten: Kitten) => {
      selectedKitten.value = kitten;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const handleSubmit = (updatedKitten: Kitten) => {
      console.log('Updated Kitten:', updatedKitten);

      closeModal();
    };

    return {
      isModalOpen,
      selectedKitten,
      openModal,
      closeModal,
      handleSubmit
    };
  }
});
</script>

<style lang="scss">
@import '@assets/scss/kittenCard.scss';
</style>
