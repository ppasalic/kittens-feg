<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Edit Kitten' : 'Create Kitten' }}</h2>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      <VeeForm @submit="handleOnSubmit" :validation-schema="createEditKittenSchema">
        <div class="form-group">
          <label for="name">Name</label>
          <VeeField
            id="name"
            name="name"
            v-model="formData.name"
            :bails="false"
            type="text"
            :rules="createEditKittenSchema.name"
            placeholder="Enter kitten's name"
          />
          <ErrorMessage class="error-message" name="name" />
        </div>
        <div class="form-group">
          <label for="imageUrl">Image URL</label>
          <VeeField
            id="imageUrl"
            name="imageUrl"
            v-model="formData.image"
            :bails="false"
            type="text"
            :rules="createEditKittenSchema.imageUrl"
            placeholder="Enter image URL"
          />
          <ErrorMessage class="error-message" name="imageUrl" />
        </div>
        <div class="form-group">
          <label for="kittenColor">Color</label>
          <VeeField
            id="kittenColor"
            name="color"
            v-model="formData.color"
            as="select"
            :rules="createEditKittenSchema.color"
          >
            <option v-for="color in uniqueKittenColors" :key="color" :value="color">
              {{ color }}
            </option>
          </VeeField>
          <ErrorMessage class="error-message" name="color" />
        </div>
        <div class="form-group">
          <label for="age">Age</label>
          <VeeField
            id="age"
            name="age"
            v-model="formData.age"
            :bails="false"
            type="text"
            :rules="createEditKittenSchema.age"
            placeholder="Enter age"
            required
          />
          <ErrorMessage class="error-message" name="age" />
        </div>
        <div class="form-group">
          <button type="submit">{{ isEditMode ? 'Save Changes' : 'Add Kitten' }}</button>
        </div>
      </VeeForm>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, type PropType, watch, computed } from 'vue';
import { uniqueKittenColors } from '../data/kittenColors';
import type { Kitten } from '../views/HomeView.vue';

export default defineComponent({
  data() {
    return {
      createEditKittenSchema: {
        name: 'required|min:3|max:30|alpha_spaces',
        imageUrl: 'required|max:50|image_url',
        color: 'required|not_one_of:Select kitten color',
        age: 'required|max:20|age_format'
      }
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    kitten: {
      type: Object as PropType<Kitten>,
      required: false,
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

    const isEditMode = computed(() => !!props.kitten && props.kitten.id !== 0);

    watch(
      () => props.kitten,
      (newKitten: Kitten) => {
        formData.value = { ...newKitten };
      },
      { immediate: true }
    );

    const handleOnSubmit = () => {
      emit('submit', formData.value);
      closeModal();
    };

    const closeModal = () => {
      emit('close');
    };

    return {
      formData,
      uniqueKittenColors,
      handleOnSubmit,
      closeModal,
      isEditMode
    };
  }
});
</script>

<style lang="scss">
@import '@assets/scss/kittenCreateEditModal.scss';
</style>
