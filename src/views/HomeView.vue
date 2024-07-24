<template>
  <div class="home-page-container">
    <KittensCarousel :carouselKittens="carouselKittens.kittens" />
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
import { ref, onMounted, defineComponent, watch, computed } from 'vue';
import KittenCard from '../components/KittenCard.vue';
import KittensSortBy from '../components/KittensSortBy.vue';
import KittensFilterBy from '../components/KittensFilterBy.vue';
import KittensSearchBy from '../components/KittensSearchBy.vue';
import KittensCarousel from '../components/KittensCarousel.vue';
import KittenCreateEditModal from '../components/KittenCreateEditModal.vue';
import KittenDeleteModal from '../components/KittenDeleteModal.vue';
import { useKittensStore } from '../stores/kittensStore';
import { ArrowDownIcon, PlusIcon } from '@heroicons/vue/24/solid';

export interface Kitten {
  id: number;
  name: string;
  color: string;
  age: string;
  image?: string;
}

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

interface CarouselSlide {
  kittens: Kitten[];
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
    const filteredKittens = ref<Kitten[]>([]);
    const visibleKittens = ref<Kitten[]>([]);
    const showButton = ref<boolean>(false);
    const sortOptions = ref<SortOptions>({ sortCriteria: 'age', sortOrder: 'asc' });
    const showMoreCards = ref<number>(20);
    const isSortResetting = ref<boolean>(false);
    const filterOptions = ref<FilterOptions>({ filters: [] });
    const searchTerm = ref<SearchTerm>({ searchTerm: '' });
    const carouselKittens = ref<CarouselSlide>({ kittens: [] });
    const isModalOpen = ref<boolean>(false);
    const isDeleteModalOpen = ref<boolean>(false);
    const selectedKitten = ref<Kitten>({ id: 0, name: '', color: '', age: '', image: '' });
    const kittens = computed(() => kittensStore.kittens);
    const isDeleteMode = ref<boolean>(false);

    onMounted(() => {
      kittensStore.fetchInitialKittens().then(() => {
        applyFiltersAndSorting();
        getCarouselKittens();
      });
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

    const resetKittens = () => {
      kittensStore.resetKittens();
    };

    const updateVisibleKittens = (isSortByOrFilterbyClicked: boolean = false) => {
      const currentLength = isSortByOrFilterbyClicked ? 0 : visibleKittens.value.length;
      visibleKittens.value = filteredKittens.value.slice(0, currentLength + showMoreCards.value);

      if (!isSortByOrFilterbyClicked) {
        sortOptions.value.sortOrder = 'asc';
        sortOptions.value.sortCriteria = 'age';
      }

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
      if (filterOptions.value.filters.length > 0 || searchTerm.value) {
        filteredKittens.value = kittens.value.filter((kitten: Kitten) => {
          const ageInMonths = parseInt(kitten.age.split(' ')[0]);
          const meetsAgeCriteria =
            (filterOptions.value.filters.includes('youngerThan6Months') && ageInMonths < 6) ||
            (filterOptions.value.filters.includes('youngerThan12Months') && ageInMonths < 12);
          const meetsColorCriteria =
            filterOptions.value.filters.includes('blackColor') && kitten.color === 'Black';

          const searchWord = searchTerm.value.searchTerm.toLowerCase();
          const matchesSearchTerm = kitten.name.toLowerCase().includes(searchWord);

          if (
            filterOptions.value.filters.length === 0 &&
            searchTerm.value.searchTerm.trim() === ''
          ) {
            return true;
          }

          if (
            filterOptions.value.filters.includes('youngerThan6Months') &&
            filterOptions.value.filters.includes('blackColor')
          ) {
            return ageInMonths < 6 && kitten.color === 'Black' && matchesSearchTerm;
          }

          if (
            filterOptions.value.filters.includes('youngerThan12Months') &&
            filterOptions.value.filters.includes('blackColor')
          ) {
            return ageInMonths < 12 && kitten.color === 'Black' && matchesSearchTerm;
          }

          if (filterOptions.value.filters.includes('youngerThan6Months')) {
            return ageInMonths < 6 && matchesSearchTerm;
          }

          if (filterOptions.value.filters.includes('youngerThan12Months')) {
            return ageInMonths < 12 && matchesSearchTerm;
          }

          if (filterOptions.value.filters.includes('blackColor')) {
            return kitten.color === 'Black' && matchesSearchTerm;
          }

          return meetsAgeCriteria || meetsColorCriteria || matchesSearchTerm;
        });
      } else if (filterOptions.value.filters.length < 0) {
        filteredKittens.value = [...kittens.value];
      } else {
        filteredKittens.value = [...visibleKittens.value];
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
      sortOptions.value = filters;
    };

    const handleOnFilterCheck = (filters: FilterOptions) => {
      filterOptions.value = filters;
    };

    const handleOnSearchInput = (search: SearchTerm) => {
      searchTerm.value = search;
    };

    const getCarouselKittens = () => {
      const kittensSortedByAge: Kitten[] = [...kittens.value].sort(
        (a, b) => parseInt(a.age) - parseInt(b.age)
      );
      carouselKittens.value.kittens = kittensSortedByAge
        .slice(0, 4)
        .map((kitten: Kitten) => ({ ...kitten }));
    };

    watch(
      [sortOptions, filterOptions, searchTerm, isSortResetting, kittens],
      () => {
        applyFiltersAndSorting();
      },
      { deep: true }
    );

    return {
      visibleKittens,
      showButton,
      carouselKittens,
      isModalOpen,
      isDeleteModalOpen,
      isDeleteMode,
      selectedKitten,
      filteredKittens,
      handleOnShowMoreClick,
      handleOnSortChange,
      handleOnFilterCheck,
      handleOnSearchInput,
      getCarouselKittens,
      openCreateModal,
      openEditModal,
      openDeleteModal,
      openAdoptModal,
      closeModal,
      closeDeleteModal,
      handleModalSubmit,
      handleDeleteKitten,
      resetKittens
    };
  }
});
</script>

<style lang="scss">
@import '@assets/scss/homeView.scss';
</style>
