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
      @adopt="$emit('on-adopt', selectedKitten)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import type { Kitten } from '../views/HomeView.vue';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/vue/24/solid';
import KittenCarouselModal from '../components/KittenCarouselModal.vue';
import { useKittensStore } from '../stores/kittensStore';

export default defineComponent({
  name: 'KittensCarousel',
  components: {
    ArrowLeftCircleIcon,
    ArrowRightCircleIcon,
    KittenCarouselModal
  },
  emits: ['on-adopt', 'close-delete-modal'],

  setup(__, { emit }) {
    const currentIndex = ref(0);
    let autoSlideInterval: NodeJS.Timeout | null = null;
    let autoSlideDirection = ref<'left' | 'right'>('right');
    const kittensStore = useKittensStore();
    const carouselKittens = computed(() =>
      [...kittensStore.kittens]
        .sort(
          (prevKitten: Kitten, nextKitten: Kitten) =>
            parseInt(prevKitten.age) - parseInt(nextKitten.age)
        )
        .slice(0, 4)
        .map((kitten) => ({ ...kitten }))
    );

    onMounted(() => {
      kittensStore.fetchInitialKittens();
    });

    const isModalOpen = ref(false);
    const selectedKitten = ref<Kitten>();

    const totalKittens = computed(() => carouselKittens.value.length);

    const displayedKittens = computed(() => {
      if (totalKittens.value === 0) return [];

      const prevIndex = (currentIndex.value - 1 + totalKittens.value) % totalKittens.value;
      const nextIndex = (currentIndex.value + 1) % totalKittens.value;

      return [
        carouselKittens.value[prevIndex],
        carouselKittens.value[currentIndex.value],
        carouselKittens.value[nextIndex]
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

    const handleDeleteKitten = (id: number) => {
      kittensStore.removeKitten(id);
      emit('close-delete-modal');
    };

    return {
      currentIndex,
      displayedKittens,
      trackStyle,
      isModalOpen,
      selectedKitten,
      prevSlide,
      nextSlide,
      getSlideClass,
      openModal,
      closeModal,
      stopAutoSlide,
      resetAutoSlide,
      handleDeleteKitten
    };
  }
});
</script>
<style lang="scss">
@import '@assets/scss/kittenCarousel.scss';
</style>
