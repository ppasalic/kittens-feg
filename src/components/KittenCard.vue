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
        <button @click="openEditModal(kitten)">
          <PencilSquareIcon class="pencil-icon" />
        </button>
        <button @click="openDeleteModal(kitten)">
          <TrashIcon class="pencil-icon" />
        </button>
      </div>
    </div>
  </div>
  <KittenCreateEditModal
    :isOpen="isEditModalOpen"
    :kitten="selectedKitten"
    @close="closeEditModal"
    @submit="handleSubmit"
  />
  <KittenDeleteModal
    :isOpen="isDeleteModalOpen"
    :kitten="selectedKitten"
    @close="closeDeleteModal"
    @submit="handleSubmit"
  />
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
import KittenCreateEditModal from './KittenCreateEditModal.vue';
import KittenDeleteModal from './KittenDeleteModal.vue';

interface Kitten {
  id: number;
  name: string;
  color: string;
  age: string;
  image?: string;
}

export default defineComponent({
  components: {
    KittenCreateEditModal,
    KittenDeleteModal,
    PencilSquareIcon,
    TrashIcon
  },
  props: {
    kitten: {
      type: Object as PropType<Kitten>,
      required: true
    }
  },
  setup() {
    const isEditModalOpen = ref(false);
    const isDeleteModalOpen = ref(false);
    const selectedKitten = ref<Kitten>();

    const openEditModal = (kitten: Kitten) => {
      selectedKitten.value = kitten;
      isEditModalOpen.value = true;
    };

    const openDeleteModal = (kitten: Kitten) => {
      selectedKitten.value = kitten;
      isDeleteModalOpen.value = true;
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
    };

    const handleSubmit = (updatedKitten: Kitten) => {
      console.log('Updated Kitten:', updatedKitten);

      closeEditModal();
    };

    return {
      isEditModalOpen,
      isDeleteModalOpen,
      selectedKitten,
      openEditModal,
      closeEditModal,
      openDeleteModal,
      closeDeleteModal,
      handleSubmit
    };
  }
});
</script>

<style lang="scss">
@import '@assets/scss/kittenCard.scss';
</style>
