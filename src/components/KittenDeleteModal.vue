<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleOnClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isDeleteMode ? 'Delete Kitten' : 'Adopt Kitten' }}</h2>
        <button class="modal-close" @click="handleOnClose">&times;</button>
      </div>
      <form @submit.prevent="handleOnSubmit">
        <p>
          Are you sure you want to {{ isDeleteMode ? 'delete' : 'adopt' }}
          <strong>{{ kitten.name }}</strong> kitten?
        </p>
        <div class="form-group reject-confirm-controls">
          <button type="submit" class="reject-btn" @click="handleOnClose">Reject</button>
          <button type="submit" class="accept-btn" @click="onSubmit">Confirm</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, watch } from 'vue';
import type Kitten from '../types/Kitten';

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
  methods: {
    handleOnSubmit() {
      this.$emit('submit', this.formData.id);
      this.handleOnClose();
    },
    handleOnClose() {
      this.$emit('close');
    }
  },
  emits: ['close', 'submit'],
  setup(props) {
    const formData = ref<Kitten>({ ...props.kitten });

    watch(
      () => props.kitten,
      (newKitten: Kitten) => {
        formData.value = { ...newKitten };
      },
      { immediate: true }
    );

    return {
      formData
    };
  }
});
</script>
<style lang="scss">
@import '@assets/scss/kittenCreateEditModal.scss';
</style>
