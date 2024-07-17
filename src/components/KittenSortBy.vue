<template>
  <div class="sort-by-container">
    <div class="sort-by-name-age">
      <label>
        <input type="radio" value="name" v-model="sortCriteria" @change="handleOnSortChange" />
        Name
      </label>
      <label>
        <input type="radio" value="age" v-model="sortCriteria" @change="handleOnSortChange" />
        Age
      </label>
    </div>
    <div class="sort-by-asc-desc">
      <label>
        <input type="radio" value="asc" v-model="sortOrder" @change="handleOnSortChange" />
        Ascending
      </label>
      <label>
        <input type="radio" value="desc" v-model="sortOrder" @change="handleOnSortChange" />
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
    const sortCriteria = ref<string>('name');
    const sortOrder = ref<string>('asc');

    const handleOnSortChange = () => {
      emit('sort-by', { sortCriteria: sortCriteria.value, sortOrder: sortOrder.value });
    };

    watch([sortCriteria, sortOrder], handleOnSortChange, { deep: true });

    return { sortCriteria, sortOrder, handleOnSortChange };
  }
});
</script>

<style lang="scss">
// the main file that imports everything related with styles
@import '@/assets/scss/kittenSortBy.scss';
</style>
