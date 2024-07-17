<template>
  <div >
    <h1>Kitten List</h1>
    <KittensSortBy @sort-by="handleOnSortChange" />
    <div class="kitten-list">
      <KittenCard
        v-for="kitten in visibleKittens"
        :key="kitten.id"
        :kitten="kitten"
        class="kitten-card"
      />
    </div>
    <div class="button-container">
      <button v-if="showButton" @click="handleOnShowMoreClick">Show More</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import KittenCard from '../components/KittenCard.vue';
import KittensSortBy from "../components/KittenSortBy.vue";

interface Kitten {
  id: number;
  name: string;
  color: string;
  age: string;
  image?: string;
}

interface SortOptions {
  sortCriteria: 'name' | 'age';
  sortOrder: 'asc' | 'desc';
}

export default defineComponent({
  components: {
    KittenCard,
    KittensSortBy,
  },
  setup() {
    const kittens = ref<Kitten[]>([]);
    const visibleKittens = ref<Kitten[]>([]);
    const showButton = ref<boolean>(false);
    const sortOptions = ref<SortOptions>({ sortCriteria: 'name', sortOrder: 'asc' });

    onMounted(async () => {
      try {
        const response = await fetch('/kittens.json');
        const data = await response.json();
        kittens.value = await Promise.all(data.kittens.map(async (kitten: Kitten) => {
          try {
            const imagePath = await import(`@/assets/images/${kitten.name}.png`);
            return {
              ...kitten,
              image: imagePath.default || '',
            };
          } catch (e) {
            return {
              ...kitten,
              image: '',
            };
          }
        }));
        sortKittens();
        updateVisibleKittens();
      } catch (e) {
        console.error('Failed to fetch kittens data:', e);
      }
    });

    const updateVisibleKittens = () => {
      const numberOfShownCards = 20;
      visibleKittens.value = kittens.value.slice(0, visibleKittens.value.length + numberOfShownCards);
      showButton.value = visibleKittens.value.length < kittens.value.length;
    };

    const sortKittens = () => {
      const { sortCriteria, sortOrder } = sortOptions.value;
      kittens.value.sort((a, b) => {
        if (sortCriteria === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
          return sortOrder === 'asc' ? parseInt(a.age) - parseInt(b.age) : parseInt(b.age) - parseInt(a.age);
        }
      });
      updateVisibleKittens();
    };

    const handleOnShowMoreClick = () => {
      updateVisibleKittens();
    };

    const handleOnSortChange = (filters: SortOptions) => {
      sortOptions.value = filters;
      sortKittens();
    };

    return { visibleKittens, showButton, handleOnShowMoreClick, handleOnSortChange };
  },
});
</script>

<style lang="scss">
// the main file that imports everything related with styles
@import '@/assets/scss/homeView.scss';
</style>
