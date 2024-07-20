<template>
  <div class="search-by-container">
    <input
      type="text"
      id="search"
      v-model="searchTerm"
      @input="handleOnSearchInput"
      placeholder="Search..."
    />
    <span class="search-icon"><MagnifyingGlassIcon class="icon" /></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';

export default defineComponent({
  name: 'KittensSearchBy',
  emits: ['search-by'],
  components: { MagnifyingGlassIcon },
  setup(_, { emit }) {
    const searchTerm = ref<string>('');

    const handleOnSearchInput = () => {
      console.log('Emitting search term:', searchTerm.value); // Debugging line
      emit('search-by', {
        searchTerm: searchTerm.value
      });
    };
    watch(searchTerm, handleOnSearchInput);

    return { searchTerm, handleOnSearchInput };
  }
});
</script>

<style lang="scss">
@import '@/assets/scss/kittenSearchBy.scss';
</style>
