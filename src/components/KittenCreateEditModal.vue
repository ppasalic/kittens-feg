<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleOnClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Edit Kitten' : 'Create Kitten' }}</h2>
        <button class="modal-close" @click="handleOnClose">&times;</button>
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
            :rules="`${createEditKittenSchema.imageUrl}|filename_matches_kitten_name:${formData.name}`"
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
            <option v-for="color in kittenColors.value" :key="color" :value="color">
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
          <button type="submit">
            {{ isEditMode ? 'Save Changes' : 'Add Kitten' }}
          </button>
        </div>
      </VeeForm>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue';
import type Kitten from '../types/Kitten';
import { KittenColorsEnum } from '../enums/KittenColorsEnum';

export default defineComponent({
  data() {
    return {
      createEditKittenSchema: {
        name: 'required|min:3|max:30|alpha_spaces',
        imageUrl: `required|max:50|image_url|filename_matches_kitten_name:@name`,
        color: 'required|not_one_of:Select kitten color',
        age: 'required|max:20|age_format'
      },
      kittenColors: {
        type: Object as PropType<KittenColorsEnum>,
        value: Object.values(KittenColorsEnum)
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

  computed: {
    isEditMode() {
      return !!this.kitten && this.kitten.id !== 0;
    }
  },
  methods: {
    handleOnSubmit() {
      this.$emit('submit', this.formData);
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
