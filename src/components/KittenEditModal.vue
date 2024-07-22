<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Edit Kitten</h2>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="kittenName">Name:</label>
          <input
            id="kittenName"
            v-model="formData.name"
            type="text"
            placeholder="Enter kitten's name"
            required
          />
        </div>
        <div class="form-group">
          <label for="kittenImage">Image URL:</label>
          <input
            id="kittenImage"
            v-model="formData.image"
            type="text"
            placeholder="Enter image URL"
            required
          />
        </div>
        <div class="form-group">
          <label for="kittenColor">Color:</label>
          <select id="kittenColor" v-model="formData.color" required>
            <option v-for="color in uniqueKittenColors" :key="color" :value="color">
              {{ color }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="kittenAge">Age:</label>
          <input
            id="kittenAge"
            v-model="formData.age"
            type="text"
            placeholder="Enter age"
            required
          />
        </div>
        <div class="form-group">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, watch } from 'vue';
import { uniqueKittenColors } from '../data/kittenColors';

interface Kitten {
  id: number;
  name: string;
  color: string;
  age: string;
  image?: string;
}

export default defineComponent({
  name: 'KittenCreateEditModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    kitten: {
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
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const formData = ref<Kitten>({ ...props.kitten });

    watch(
      () => props.kitten,
      (newKitten: Kitten) => {
        formData.value = { ...newKitten };
      },
      { immediate: true }
    );

    const handleSubmit = () => {
      emit('submit', formData.value);
      closeModal();
    };

    const closeModal = () => {
      emit('close');
    };

    return {
      formData,
      uniqueKittenColors,
      handleSubmit,
      closeModal
    };
  }
});
</script>
<style lang="scss">
@import '@assets/scss/kittenCreateEditModal.scss';
</style>
