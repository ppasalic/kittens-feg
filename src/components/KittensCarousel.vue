<template>
  <div class="carousel">
    <div class="carousel-track-container">
      <div class="carousel-track" :style="trackStyle">
        <div
          v-for="(kitten, index) in displayedKittens"
          :key="kitten.name"
          class="carousel-slide"
          :class="getSlideClass(index)"
          @click="openModal(kitten)"
          @mouseover="stopAutoSlide"
          @mouseleave="resetAutoSlide"
        >
          <img :src="kitten.image" :alt="'Image ' + (currentIndex + index)" />
          <div class="kitten-name">{{ kitten.name }}</div>
        </div>
      </div>
    </div>
    <div class="carousel-controls">
      <button @click="prevSlide"><ArrowLeftCircleIcon class="arrow-icon" /></button>
      <button @click="nextSlide"><ArrowRightCircleIcon class="arrow-icon" /></button>
    </div>

    <KittenCarouselModal
      :isOpen="isModalOpen"
      :selectedKitten="selectedKitten"
      @click="closeModal"
      @adopt="openAdoptModal"
    />
    <KittenDeleteModal
      :isOpen="isDeleteModalOpen"
      :kitten="selectedKitten"
      :isDeleteMode="isDeleteMode"
      @close="closeDeleteModal"
      @submit="handleDeleteKitten"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import type { Kitten } from '../views/HomeView.vue';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/vue/24/solid';
import KittenCarouselModal from '../components/KittenCarouselModal.vue';
import KittenDeleteModal from '../components/KittenDeleteModal.vue';
import { useKittensStore } from '../stores/kittensStore';

export default defineComponent({
  name: 'KittensCarousel',
  components: {
    ArrowLeftCircleIcon,
    ArrowRightCircleIcon,
    KittenCarouselModal,
    KittenDeleteModal
  },
  props: {
    carouselKittens: {
      type: Array as () => Kitten[],
      required: true
    }
  },
  setup(props) {
    const currentIndex = ref(0);
    let autoSlideInterval: NodeJS.Timeout | null = null;
    let autoSlideDirection = ref<'left' | 'right'>('right');
    const isDeleteMode = ref<boolean>(false);
    const isDeleteModalOpen = ref<boolean>(false);
    const kittensStore = useKittensStore();

    const isModalOpen = ref(false);
    const selectedKitten = ref<Kitten>();

    const totalKittens = computed(() => props.carouselKittens.length);

    const displayedKittens = computed(() => {
      if (totalKittens.value === 0) return [];

      const prevIndex = (currentIndex.value - 1 + totalKittens.value) % totalKittens.value;
      const nextIndex = (currentIndex.value + 1) % totalKittens.value;

      return [
        props.carouselKittens[prevIndex],
        props.carouselKittens[currentIndex.value],
        props.carouselKittens[nextIndex]
      ];
    });

    const trackStyle = computed(() => ({
      transition: 'transform 0.5s ease-in-out'
    }));

    const getSlideClass = (index: number) => {
      if (index === 1) return 'active-slide';
      if (index === 0) return 'prev-slide';
      if (index === 2) return 'next-slide';
      return '';
    };

    const updateIndex = (newIndex: number) => {
      currentIndex.value = (newIndex + totalKittens.value) % totalKittens.value;
    };

    const moveCarousel = (direction: 'left' | 'right') => {
      if (direction === 'right') {
        updateIndex(currentIndex.value + 1);
      } else {
        updateIndex(currentIndex.value - 1);
      }
    };

    const prevSlide = () => {
      autoSlideDirection.value = 'left';
      moveCarousel('left');
      resetAutoSlide();
    };

    const nextSlide = () => {
      autoSlideDirection.value = 'right';
      moveCarousel('right');
      resetAutoSlide();
    };

    const startAutoSlide = () => {
      if (!autoSlideInterval) {
        autoSlideInterval = setInterval(() => {
          moveCarousel(autoSlideDirection.value);
        }, 3000);
      }
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    };

    const resetAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    onMounted(() => {
      startAutoSlide();
    });

    onUnmounted(() => {
      stopAutoSlide();
    });

    const openModal = (kitten: Kitten) => {
      selectedKitten.value = kitten;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const openAdoptModal = (kitten: Kitten) => {
      console.log('kitten', kitten);
      selectedKitten.value = { ...kitten };
      isDeleteMode.value = false;
      isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
    };

    const handleDeleteKitten = (id: number) => {
      kittensStore.removeKitten(id);
      closeDeleteModal();
    };

    return {
      currentIndex,
      displayedKittens,
      trackStyle,
      isModalOpen,
      selectedKitten,
      isDeleteModalOpen,
      isDeleteMode,
      prevSlide,
      nextSlide,
      getSlideClass,
      openModal,
      closeModal,
      stopAutoSlide,
      resetAutoSlide,
      openAdoptModal,
      closeDeleteModal,
      handleDeleteKitten
    };
  }
});
</script>
<style lang="scss">
@import '@assets/scss/kittenCarousel.scss';
</style>
