<template>
  <div class="sort-by-container">
    <div class="sort-by-name-age">
      <div class="sort-by-radio">
        <input
          type="radio"
          id="name"
          value="name"
          name="name-age-sort"
          v-model="sortCriteria"
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
          v-model="sortCriteria"
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
          v-model="sortOrder"
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
          v-model="sortOrder"
          @change="handleOnSortChange"
        />
        <label for="desc">Descending</label>
      </div>
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
@import '@assets/scss/kittenSortBy.scss';
</style>
