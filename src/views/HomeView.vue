<template>
  <div class="home-page-container">
    <KittensCarousel @on-adopt="openAdoptModal" @close-delete-modal="closeDeleteModal" />
    <KittensSortBy @sort-by="handleOnSortChange" />
    <KittensFilterBy @filter-by="handleOnFilterCheck" />
    <KittenCreateEditModal
      :isOpen="isModalOpen"
      :kitten="selectedKitten"
      @close="closeModal"
      @submit="handleModalSubmit"
    />
    <KittenDeleteModal
      :isOpen="isDeleteModalOpen"
      :kitten="selectedKitten"
      :isDeleteMode="isDeleteMode"
      @close="closeDeleteModal"
      @submit="handleDeleteKitten"
    />
    <div class="search-add-new-wrapper">
      <KittensSearchBy @search-by="handleOnSearchInput" />
      <div class="add-new-wrapper">
        <button v-if="showButton" class="add-new-btn" @click="openCreateModal">
          <span>Add new </span>
          <span class="icon"><PlusIcon class="plus-icon" /></span>
        </button>
      </div>
    </div>
    <div class="kitten-list">
      <KittenCard
        v-for="kitten in visibleKittens"
        :key="kitten.id"
        :kitten="kitten"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @adopt="openAdoptModal"
      />
    </div>
    <div class="button-container">
      <button v-if="showButton" @click.prevent="handleOnShowMoreClick" class="show-more-btn">
        <span>Show More</span>
        <ArrowDownIcon class="arrow-down-icon" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, computed } from 'vue';
import KittenCard from '../components/KittenCard.vue';
import KittensSortBy from '../components/KittensSortBy.vue';
import KittensFilterBy from '../components/KittensFilterBy.vue';
import KittensSearchBy from '../components/KittensSearchBy.vue';
import KittensCarousel from '../components/KittensCarousel.vue';
import KittenCreateEditModal from '../components/KittenCreateEditModal.vue';
import KittenDeleteModal from '../components/KittenDeleteModal.vue';
import { useKittensStore } from '../stores/kittensStore';
import { ArrowDownIcon, PlusIcon } from '@heroicons/vue/24/solid';
import type Kitten from '../types/Kitten';

export interface SortOptions {
  sortCriteria: 'name' | 'age';
  sortOrder: 'asc' | 'desc';
}

interface FilterOptions {
  filters: string[];
}

interface SearchTerm {
  searchTerm: string;
}

export default defineComponent({
  components: {
    KittensCarousel,
    KittenCard,
    KittensSortBy,
    KittensFilterBy,
    KittensSearchBy,
    KittenCreateEditModal,
    KittenDeleteModal,
    ArrowDownIcon,
    PlusIcon
  },
  setup() {
    const kittensStore = useKittensStore();
    const sortOptions = ref<SortOptions>({ sortCriteria: 'age', sortOrder: 'asc' });
    const showMoreCards = ref<number>(20);
    const filterOptions = ref<FilterOptions>({ filters: [] });
    const searchTerm = ref<SearchTerm>({ searchTerm: '' });
    const isModalOpen = ref<boolean>(false);
    const isDeleteModalOpen = ref<boolean>(false);
    const selectedKitten = ref<Kitten>({ id: 0, name: '', color: '', age: '', image: '' });
    const kittens = computed(() => kittensStore.kittens);
    const isDeleteMode = ref<boolean>(false);

    const filteredKittens = computed(() => {
      if (searchTerm.value.searchTerm.trim() !== '') {
        return kittens.value.filter((kitten: Kitten) => {
          const searchWord = searchTerm.value.searchTerm.toLowerCase();
          return kitten.name.toLowerCase().includes(searchWord);
        });
      }

      return kittens.value.filter((kitten: Kitten) => {
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
    });

    const sortedKittens = computed(() => {
      const { sortCriteria, sortOrder } = sortOptions.value;
      return [...filteredKittens.value].sort((a, b) => {
        if (sortCriteria === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
          return sortOrder === 'asc'
            ? parseInt(a.age) - parseInt(b.age)
            : parseInt(b.age) - parseInt(a.age);
        }
      });
    });

    const visibleKittens = computed(() => {
      const currentLength = showMoreCards.value;
      return sortedKittens.value.slice(0, currentLength);
    });

    const showButton = computed(() => visibleKittens.value.length < filteredKittens.value.length);

    onMounted(() => {
      kittensStore.fetchInitialKittens();
    });

    const openCreateModal = () => {
      selectedKitten.value = { id: 0, name: '', color: '', age: '', image: '' };
      isModalOpen.value = true;
    };

    const openEditModal = (kitten: Kitten) => {
      selectedKitten.value = { ...kitten };
      isModalOpen.value = true;
    };

    const openDeleteModal = (kitten: Kitten) => {
      selectedKitten.value = { ...kitten };
      isDeleteMode.value = true;
      isDeleteModalOpen.value = true;
    };

    const openAdoptModal = (kitten: Kitten) => {
      selectedKitten.value = { ...kitten };
      isDeleteMode.value = false;
      isDeleteModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
    };

    const handleModalSubmit = (kitten: Kitten) => {
      if (kitten.id === 0) {
        kittensStore.addKitten(kitten);
      } else {
        kittensStore.updateKitten(kitten);
      }
      closeModal();
    };

    const handleDeleteKitten = (id: number) => {
      kittensStore.removeKitten(id);
      closeDeleteModal();
    };

    const resetSortOptions = () => {
      sortOptions.value.sortCriteria = 'age';
      sortOptions.value.sortOrder = 'asc';
    };

    const handleOnShowMoreClick = () => {
      showMoreCards.value += 20;
      resetSortOptions();
    };

    const handleOnSortChange = (filters: SortOptions) => {
      sortOptions.value = filters;
    };

    const handleOnFilterCheck = (filters: FilterOptions) => {
      filterOptions.value = filters;
    };

    const handleOnSearchInput = (search: SearchTerm) => {
      searchTerm.value = search;
    };

    return {
      visibleKittens,
      showButton,
      sortOptions,
      isModalOpen,
      isDeleteModalOpen,
      isDeleteMode,
      selectedKitten,
      filteredKittens,
      handleOnShowMoreClick,
      handleOnSortChange,
      handleOnFilterCheck,
      handleOnSearchInput,
      openCreateModal,
      openEditModal,
      openDeleteModal,
      openAdoptModal,
      closeModal,
      closeDeleteModal,
      handleModalSubmit,
      handleDeleteKitten
    };
  }
});
</script>

<style lang="scss">
@import '@assets/scss/homeView.scss';
</style>
