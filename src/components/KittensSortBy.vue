<template>
  <div class="sort-by-container">
    <div class="sort-by-name-age">
      <div class="sort-by-radio">
        <input
          type="radio"
          id="name"
          value="name"
          name="name-age-sort"
          v-model="sortByRadioButtonsValues.sortCriteria"
          @change="handleOnSortChange"
        />
        <label for="name">Name</label>
      </div>
      <div class="sort-by-radio">
        <input
          type="radio"
          id="age"
          value="age"
          name="name-age-sort"
          v-model="sortByRadioButtonsValues.sortCriteria"
          @change="handleOnSortChange"
        />
        <label for="age">Age</label>
      </div>
    </div>
    <div class="sort-by-asc-desc">
      <div class="sort-by-radio">
        <input
          type="radio"
          id="asc"
          value="asc"
          name="asc-desc-sort"
          v-model="sortByRadioButtonsValues.sortOrder"
          @change="handleOnSortChange"
        />
        <label for="asc">Ascending</label>
      </div>
      <div class="sort-by-radio">
        <input
          type="radio"
          id="desc"
          value="desc"
          name="asc-desc-sort"
          v-model="sortByRadioButtonsValues.sortOrder"
          @change="handleOnSortChange"
        />
        <label for="desc">Descending</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { SortOptions } from '../views/HomeView.vue';
import { defineComponent, ref, watch, type PropType } from 'vue';

export default defineComponent({
  name: 'KittensSortBy',
  props: {
    sortOptions: {
      type: Object as PropType<SortOptions>,
      required: true,
      default: () => ({
        sortCriteria: 'age',
        sortOrder: 'asc'
      })
    }
  },
  emits: ['sort-by'],
  setup(props, { emit }) {
    const sortByRadioButtonsValues = ref<SortOptions>({ ...props.sortOptions });

    const handleOnSortChange = () => {
      emit('sort-by', sortByRadioButtonsValues.value);
    };

    watch(
      () => props.sortOptions,
      (newSortOptions) => {
        sortByRadioButtonsValues.value = { ...newSortOptions };
      },
      { immediate: true }
    );

    return { sortByRadioButtonsValues, handleOnSortChange };
  }
});
</script>

<style lang="scss">
// the main file that imports everything related with styles
@import '@assets/scss/kittenSortBy.scss';
</style>
