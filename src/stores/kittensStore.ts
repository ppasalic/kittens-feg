import type Kitten from '../types/Kitten';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useKittensStore = defineStore('kittensStore', () => {
  const kittens = ref<Kitten[]>([]);

  const fetchInitialKittens = async () => {
    try {
      const response = await fetch('/kittens.json');
      const data = await response.json();

      const updatedKittens = await Promise.all(
        data.kittens.map(async (kitten: Kitten) => {
          try {
            const imagePath = `/assets/images/${kitten.name}.jpg`;
            return {
              ...kitten,
              image: imagePath
            };
          } catch (e) {
            return {
              ...kitten,
              image: ''
            };
          }
        })
      );

      kittens.value = updatedKittens;
    } catch (error) {
      console.error('Failed to fetch initial kittens:', error);
    }
  };

  const addKitten = (newKitten: Kitten) => {
    const newId = Math.max(...kittens.value.map((k) => k.id)) + 1;
    newKitten.id = newId;
    kittens.value.push(newKitten);
  };

  const updateKitten = (updatedKitten: Kitten) => {
    const index = kittens.value.findIndex((kitten) => kitten.id === updatedKitten.id);
    if (index !== -1) {
      kittens.value[index] = { ...kittens.value[index], ...updatedKitten };
    }
  };

  const removeKitten = (id: number) => {
    kittens.value = kittens.value.filter((kitten) => kitten.id !== id);
  };

  const resetKittens = () => {
    fetchInitialKittens();
  };

  return {
    kittens,
    fetchInitialKittens,
    addKitten,
    updateKitten,
    removeKitten,
    resetKittens
  };
});
