<template>
  <div class="filter-by-container">
    <input
      type="checkbox"
      id="youngerThan6Months"
      value="youngerThan6Months"
      v-model="filters"
      @change="handleOnFilterCheck"
    />
    <label for="youngerThan6Months"> Younger than 6 months </label>
    <input
      type="checkbox"
      id="youngerThan12Months"
      value="youngerThan12Months"
      v-model="filters"
      @change="handleOnFilterCheck"
    />
    <label for="youngerThan12Months"> Younger than 12 months </label>
    <input
      type="checkbox"
      id="blackColor"
      value="blackColor"
      v-model="filters"
      @change="handleOnFilterCheck"
    />
    <label for="blackColor"> Black color </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'KittensFilterBy',
  emits: ['filter-by'],
  setup(_, { emit }) {
    const filters = ref<string[]>([]);

    const handleOnFilterCheck = () => {
      emit('filter-by', {
        filters: filters.value
      });
    };

    watch(filters, handleOnFilterCheck, {
      deep: true
    });

    return { filters, handleOnFilterCheck };
  }
});
</script>

<style lang="scss">
@import '@/assets/scss/kittenSortBy.scss';
</style>
