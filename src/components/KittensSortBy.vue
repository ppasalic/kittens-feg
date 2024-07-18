<template>
  <div class="sort-by-container">
    <div class="sort-by-name-age">
      <label>
        <input
          type="radio"
          value="name"
          name="name-age-sort"
          v-model="sortCriteria"
          @change="handleOnSortChange"
        />
        Name
      </label>
      <label>
        <input
          type="radio"
          value="age"
          name="name-age-sort"
          v-model="sortCriteria"
          @change="handleOnSortChange"
        />
        Age
      </label>
    </div>
    <div class="sort-by-asc-desc">
      <label>
        <input
          type="radio"
          value="asc"
          name="asc-desc-sort"
          v-model="sortOrder"
          @change="handleOnSortChange"
        />
        Ascending
      </label>
      <label>
        <input
          type="radio"
          value="desc"
          name="asc-desc-sort"
          v-model="sortOrder"
          @change="handleOnSortChange"
        />
        Descending
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'KittensSortBy',
  emits: ['sort-by'],
  setup(_, { emit }) {
    const sortCriteria = ref<string>('age');
    const sortOrder = ref<string>('asc');

    const handleOnSortChange = () => {
      emit('sort-by', { sortCriteria: sortCriteria, sortOrder: sortOrder });
    };

    watch([sortCriteria, sortOrder], handleOnSortChange, { immediate: true });

    return { sortCriteria, sortOrder, handleOnSortChange };
  }
});
</script>

<style lang="scss">
// the main file that imports everything related with styles
@import '@/assets/scss/kittenSortBy.scss';
</style>
