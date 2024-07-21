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

    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Kitten info</h2>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <h3>Name: {{ selectedKitten?.name }}</h3>
        <p>Color: {{ selectedKitten?.color }}</p>
        <p>Age: {{ selectedKitten?.age }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { Kitten } from '../views/HomeView.vue';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/vue/24/solid';

export default defineComponent({
  name: 'KittensCarousel',
  components: {
    ArrowLeftCircleIcon,
    ArrowRightCircleIcon
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

    const isModalOpen = ref(false);
    const selectedKitten = ref<Kitten | null>(null);

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

    const slideWidth = computed(() => 100 / 33);

    const trackStyle = computed(() => ({
      transform: `translateX(-${currentIndex.value * slideWidth.value}%)`,
      transition: 'transform 1s ease-in-out'
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
      selectedKitten.value = null;
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
      resetAutoSlide
    };
  }
});
</script>
<style lang="scss">
@import '@/assets/scss/kittenCarousel.scss';
</style>
