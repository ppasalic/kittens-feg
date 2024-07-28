<template>
  <div class="sort-by-container">
    <div class="sort-by-name-age">
      <div
        v-for="([key, value]) in Object.entries(SortCriteriaEnum)"
        :key="key"
        class="sort-by-radio"
      >
        <input
          type="radio"
          id="value"
          :value="value"
          name="name-age-sort"
          v-model="kittensSortOptions.sortCriteria"
          @change="handleOnSortChange"
        />
        <label :for="value">{{ key }}</label>
      </div>
    </div>
    <div class="sort-by-asc-desc">
      <div
        v-for="[key, value ] in Object.entries(SortOrderEnum)"
        :key="key"
        class="sort-by-radio"
      >
        <input
          type="radio"
          :id="value"
          :value="value"
          name="asc-desc-sort"
          v-model="kittensSortOptions.sortOrder"
          @change="handleOnSortChange"
        />
        <label :for="value">{{ key }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType } from 'vue';
import type { SortOptions } from '../types/SortOptions';
import SortCriteriaEnum from '../enums/SortCriteriaEnum';
import SortOrderEnum from '../enums/SortOrderEnum';

export default defineComponent({
  name: 'KittensSortBy',
  props: {
    sortOptions: {
      type: Object as PropType<SortOptions>,
      required: true,
      default: () => ({
          sortCriteria: SortCriteriaEnum.Age,
          sortOrder: SortOrderEnum.Ascending
      })
    }
  },
  emits: ['sort-by'],
  setup(props, { emit }) {
    const kittensSortOptions = ref<SortOptions>({ ...props.sortOptions });

    const handleOnSortChange = () => {
      emit('sort-by', kittensSortOptions.value);
    };

    watch(
      () => props.sortOptions,
      (newSortOptions) => {
        kittensSortOptions.value = { ...newSortOptions };
      },
      { immediate: true }
    );

    return { kittensSortOptions, SortCriteriaEnum, SortOrderEnum, handleOnSortChange };
  }
});
</script>

<style lang="scss">
@import '@assets/scss/kittenSortBy.scss';
</style>
