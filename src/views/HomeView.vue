<template>
  <div>
    <h1>Kitten List</h1>
    <KittensSortBy @sort-by="handleOnSortChange" />
    <KittensFilterBy @filter-by="handleOnFilterCheck" />
    <div class="kitten-list">
      <KittenCard
        v-for="kitten in visibleKittens"
        :key="kitten.id"
        :kitten="kitten"
        class="kitten-card"
      />
    </div>
    <div class="button-container">
      <button v-if="showButton" @click.prevent="handleOnShowMoreClick">Show More</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, watch } from 'vue';
import KittenCard from '../components/KittenCard.vue';
import KittensSortBy from '../components/KittensSortBy.vue';
import KittensFilterBy from '../components/KittensFilterBy.vue';

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

interface FilterOptions {
  filters: string[];
}

export default defineComponent({
  components: {
    KittenCard,
    KittensSortBy,
    KittensFilterBy
  },
  setup() {
    const kittens = ref<Kitten[]>([]);
    const filteredKittens = ref<Kitten[]>([]);
    const visibleKittens = ref<Kitten[]>([]);
    const showButton = ref<boolean>(false);
    const sortOptions = ref<SortOptions>({ sortCriteria: 'age', sortOrder: 'asc' });
    const showMoreCards = ref<number>(20);
    const isSortResetting = ref<boolean>(false);
    const filterOptions = ref<FilterOptions>({ filters: [] });

    onMounted(async () => {
      try {
        const response = await fetch('/kittens.json');
        const data = await response.json();
        kittens.value = await Promise.all(
          data.kittens.map(async (kitten: Kitten) => {
            try {
              const imagePath = await import(`@/assets/images/${kitten.name}.png`);
              return {
                ...kitten,
                image: imagePath.default || ''
              };
            } catch (e) {
              return {
                ...kitten,
                image: ''
              };
            }
          })
        );
        applyFiltersAndSorting();
      } catch (e) {
        console.error('Failed to fetch kittens data:', e);
      }
    });

    const updateVisibleKittens = (reset: boolean = false) => {
      const currentLength = reset ? 0 : visibleKittens.value.length;
      visibleKittens.value = filteredKittens.value.slice(0, currentLength + showMoreCards.value);
      showButton.value = visibleKittens.value.length < filteredKittens.value.length;
    };

    const sortKittens = () => {
      const { sortCriteria, sortOrder } = sortOptions.value;

      filteredKittens.value.sort((a, b) => {
        if (sortCriteria === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
          return sortOrder === 'asc'
            ? parseInt(a.age) - parseInt(b.age)
            : parseInt(b.age) - parseInt(a.age);
        }
      });
    };

    const filterKittens = () => {
      if (filterOptions.value.filters.length > 0) {
        filteredKittens.value = kittens.value.filter((kitten: Kitten) => {
          const ageInMonths = parseInt(kitten.age.split(' ')[0]);
          const meetsAgeCriteria =
            (filterOptions.value.filters.includes('youngerThan6Months') && ageInMonths < 6) ||
            (filterOptions.value.filters.includes('youngerThan12Months') && ageInMonths < 12);
          const meetsColorCriteria =
            filterOptions.value.filters.includes('blackColor') && kitten.color === 'Black';

          if (filterOptions.value.filters.length === 0) {
            return true;
          }

          if (
            filterOptions.value.filters.includes('youngerThan6Months') &&
            filterOptions.value.filters.includes('blackColor')
          ) {
            return ageInMonths < 6 && kitten.color === 'Black';
          }

          if (
            filterOptions.value.filters.includes('youngerThan12Months') &&
            filterOptions.value.filters.includes('blackColor')
          ) {
            return ageInMonths < 12 && kitten.color === 'Black';
          }

          if (filterOptions.value.filters.includes('youngerThan6Months')) {
            return ageInMonths < 6;
          }

          if (filterOptions.value.filters.includes('youngerThan12Months')) {
            return ageInMonths < 12;
          }

          if (filterOptions.value.filters.includes('blackColor')) {
            return kitten.color === 'Black';
          }

          return meetsAgeCriteria || meetsColorCriteria;
        });
      } else {
        filteredKittens.value = [...kittens.value];
      }
    };

    const applyFiltersAndSorting = () => {
      filterKittens();
      sortKittens();
      updateVisibleKittens(true);
    };

    const handleOnShowMoreClick = () => {
      updateVisibleKittens();
    };

    const handleOnSortChange = (filters: SortOptions) => {
      if (isSortResetting.value) {
        isSortResetting.value = false;
        return;
      }
      sortOptions.value = filters;
      applyFiltersAndSorting();
    };

    const handleOnFilterCheck = (filters: FilterOptions) => {
      filterOptions.value = filters;
      applyFiltersAndSorting();
    };

    watch(showButton, (newValue) => {
      if (!newValue) {
        isSortResetting.value = true;
        sortOptions.value.sortCriteria = 'age';
        sortOptions.value.sortOrder = 'asc';
        applyFiltersAndSorting();
      }
    });

    watch(
      [sortOptions, filterOptions],
      () => {
        applyFiltersAndSorting();
      },
      { deep: true }
    );

    return {
      visibleKittens,
      showButton,
      handleOnShowMoreClick,
      handleOnSortChange,
      handleOnFilterCheck
    };
  }
});
</script>

<style lang="scss">
@import '@/assets/scss/homeView.scss';
</style>
