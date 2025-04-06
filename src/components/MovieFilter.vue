<!-- src/components/MovieFilter.vue -->
<template>
  <v-card variant="flat" color="transparent" class="mb-4">
    <v-card-title>Filtros</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select v-model="selectedGenre" :items="genres" item-title="name" item-value="id" label="Gênero"
            variant="outlined" density="comfortable" hide-details clearable
            @update:model-value="applyFilters"></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select v-model="selectedYear" :items="years" label="Ano" variant="outlined" density="comfortable"
            hide-details clearable @update:model-value="applyFilters"></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select v-model="selectedRating" :items="ratings" label="Nota mínima" variant="outlined"
            density="comfortable" hide-details clearable @update:model-value="applyFilters"></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="12" lg="3" class="d-flex align-center">
          <v-btn color="primary" size="large" variant="outlined" class="mr-2" @click="resetFilters">
            Limpar Filtros
          </v-btn>

          <v-btn color="primary" size="large" @click="applyFilters">
            Aplicar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';

export default {
  name: 'MovieFilter',

  emits: ['filter'],

  setup(props, { emit }) {
    const selectedGenre = ref(null);
    const selectedYear = ref(null);
    const selectedRating = ref(null);
    const genres = ref([]);

    // Gerar array de anos dos últimos 30 anos
    const currentYear = new Date().getFullYear();
    const years = ref(Array.from({ length: 30 }, (_, i) => currentYear - i));

    // Array de notas de 1 a 9
    const ratings = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Carregar gêneros ao montar o componente
    onMounted(async () => {
      try {
        const response = await api.getGenres();
        if (response && response.genres) {
          genres.value = response.genres;
        }
      } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
      }
    });

    // Aplicar filtros
    const applyFilters = () => {
      emit('filter', {
        genreId: selectedGenre.value,
        year: selectedYear.value,
        rating: selectedRating.value
      });
    };

    // Resetar filtros
    const resetFilters = () => {
      selectedGenre.value = null;
      selectedYear.value = null;
      selectedRating.value = null;

      emit('filter', {
        genreId: null,
        year: null,
        rating: null
      });
    };

    return {
      selectedGenre,
      selectedYear,
      selectedRating,
      genres,
      years,
      ratings,
      applyFilters,
      resetFilters
    };
  }
}
</script>