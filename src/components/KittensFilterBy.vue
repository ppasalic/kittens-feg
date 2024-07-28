<template>
  <div class="filter-by-container">
    <div class="filter-by-checkbox" v-for="filter in Object.values(FilterOptionsEnum)" :key="filter">
      <input
        type="checkbox"
        :id="filter"
        :value="filter"
        v-model="kittensFilters"
        @change="handleOnFilterCheck"
      />
      <label :for="filter"> {{ filter }} </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { FilterOptionsEnum } from '../enums/FilterOptionsEnum';
import type FilterOptions from '../types/FilterOptions';

export default defineComponent({
  name: 'KittensFilterBy',
  emits: ['filter-by'],
  setup(_, { emit }) {
    const kittensFilters = ref<FilterOptions[]>([]);
    const handleOnFilterCheck = () => {
      emit('filter-by', kittensFilters.value);
    };

    watch(kittensFilters, handleOnFilterCheck, {
      immediate: true
    });

    return { kittensFilters, FilterOptionsEnum, handleOnFilterCheck };
  }
});
</script>

<style lang="scss">
@import '@assets/scss/kittenFilterBy.scss';
</style>
