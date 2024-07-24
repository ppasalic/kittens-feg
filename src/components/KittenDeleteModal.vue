<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isDeleteMode ? 'Delete Kitten' : 'Adopt Kitten' }}</h2>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit">
        <p>
          Are you sure you want to {{ isDeleteMode ? 'delete' : 'adopt' }}
          <strong>{{ kitten.name }}</strong> kitten?
        </p>
        <div class="form-group reject-confirm-controls">
          <button type="submit" class="reject-btn" @click="closeModal">Reject</button>
          <button type="submit" class="accept-btn" @click="onSubmit">Confirm</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, watch } from 'vue';

interface Kitten {
  id: number;
  name: string;
  color: string;
  age: string;
  image?: string;
}

export default defineComponent({
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
    },
    isDeleteMode: {
      type: Boolean
    }
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const formData = ref<Kitten>({ ...props.kitten });

    console.log('kitten ', { ...props.kitten });
    watch(
      () => props.kitten,
      (newKitten: Kitten) => {
        formData.value = { ...newKitten };
      },
      { immediate: true }
    );

    const handleSubmit = () => {
      emit('submit', formData.value.id);
      closeModal();
    };

    const closeModal = () => {
      emit('close');
    };

    return {
      formData,
      handleSubmit,
      closeModal
    };
  }
});
</script>
<style lang="scss">
@import '@assets/scss/kittenCreateEditModal.scss';
</style>
