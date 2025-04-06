<!-- src/views/HomeView.vue -->
<template>
  <div color="transparent">
    <v-container class="text-center">
      <h1 class="display-1 font-weight-bold tagline">
        O seu guia para filmes e séries <br>do jeito que você gosta
      </h1>
    </v-container>

    <v-sheet class="mb-6" elevation="0" color="transparent">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <h2 class="text-h5 font-weight-bold mb-0">Destaques</h2>
        </v-col>

        <v-col cols="12" md="6" class="text-end">
          <!-- Barra de busca -->
          <search-bar @search="searchMovies" />
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Loading indicator -->
    <v-row v-if="loading" color="transparent">
      <v-col cols="12" sm="6" md="3" v-for="n in 4" :key="n">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <!-- Resultados da busca (se houver) -->
    <div v-else-if="searchResults.length > 0" class="mt-8">
      <h2 class="text-h5 font-weight-bold mb-0">Resultados da Busca</h2>
      <v-row>
        <v-col v-for="movie in searchResults" :key="movie.id" cols="12" sm="6" md="4" lg="3">
          <movie-card :movie="movie" />
        </v-col>
      </v-row>

      <div class="text-center mt-4">
        <v-btn color="primary" :to="{ name: 'movieList', query: { query: searchQuery } }">
          Ver mais resultados
        </v-btn>

        <v-btn class="ml-2" variant="outlined" color="primary" @click="clearSearch">
          Voltar à página inicial
        </v-btn>
      </div>
    </div>

    <!-- Conteúdo normal (quando não há pesquisa) -->
    <div v-else-if="popularMovies.length > 0">
      <!-- Carrossel de filmes em destaque -->
      <movie-carousel :movies="popularMovies.slice(0, 8)" />

      <!-- Nova seção de blog/notícias -->
      <news-section />

      <!-- Filmes populares -->
      <div class="mt-8">
        <div class="d-flex align-center justify-space-between mb-3">
          <h2 class="text-h5 font-weight-bold mb-0">Filmes</h2>
          <v-btn variant="text" color="primary" :to="{ name: 'movieList' }">
            Ver todos
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <v-row>
          <v-col v-for="movie in popularMovies.slice(5, 9)" :key="movie.id" cols="12" sm="6" md="3" lg="3">
            <movie-card :movie="movie" />
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Erro ao carregar filmes -->
    <v-alert v-else type="error"
      text="Ocorreu um erro ao carregar os filmes. Por favor, tente novamente mais tarde."></v-alert>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import SearchBar from '../components/SearchBar.vue';
import MovieCarousel from '../components/MovieCarousel.vue';
import MovieCard from '../components/MovieCard.vue';
import NewsSection from '../components/NewsSection.vue';

export default {
  name: 'HomeView',

  components: {
    SearchBar,
    MovieCarousel,
    MovieCard,
    NewsSection
  },

  setup() {
    const popularMovies = ref([]);
    const searchResults = ref([]);
    const searchQuery = ref('');
    const loading = ref(true);

    // Carregar filmes populares ao montar o componente
    onMounted(async () => {
      try {
        const response = await api.getPopularMovies();
        if (response && response.results) {
          popularMovies.value = response.results;
        }
      } catch (error) {
        console.error('Erro ao carregar filmes populares:', error);
      } finally {
        loading.value = false;
      }
    });

    // Buscar filmes
    const searchMovies = async (query) => {
      if (!query.trim()) {
        clearSearch();
        return;
      }

      loading.value = true;
      searchQuery.value = query;

      try {
        const response = await api.searchMovies(query);
        if (response && response.results) {
          searchResults.value = response.results.slice(0, 16);
        }
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
        searchResults.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Limpar pesquisa e voltar à exibição normal
    const clearSearch = () => {
      searchResults.value = [];
      searchQuery.value = '';
    };

    return {
      popularMovies,
      searchResults,
      searchQuery,
      loading,
      searchMovies,
      clearSearch
    };
  }
}
</script>

<style scoped>
.tagline {
  color: white;
  text-shadow: 2px 2px 6px rgba(255, 255, 255, 0.6);
  font-size: 4rem;
}
</style>