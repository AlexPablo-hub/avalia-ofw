<!-- src/views/MovieListView.vue -->
<template>
  <div>
    <v-sheet class="mb-6" elevation="0" color="transparent">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <h2 class="text-h5 font-weight-bold mb-0">Explorar Filmes</h2>
        </v-col>

        <v-col cols="12" md="6" class="text-end">
          <!-- Barra de busca -->
          <search-bar @search="searchMovies" />
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Filtros -->
    <movie-filter @filter="applyFilters" />

    <!-- Loading indicator -->
    <v-sheet v-if="loading" class="text-center pa-6">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-sheet>

    <!-- Resultados -->
    <template v-else>
      <!-- Título da seção baseado na busca/filtro -->
      <h2 class="text-h5 mb-4">
        <span v-if="searchQuery">Resultados para: "{{ searchQuery }}"</span>
        <span v-else-if="activeFilters">Filmes Filtrados</span>
        <span v-else>Filmes Populares</span>
        <span class="text-subtitle-1 ml-2">({{ totalResults }} encontrados)</span>
      </h2>

      <!-- Lista de filmes -->
      <v-row v-if="movies.length > 0">
        <v-col v-for="movie in movies" :key="movie.id" cols="12" sm="6" md="4" lg="3">
          <movie-card :movie="movie" />
        </v-col>
      </v-row>

      <!-- Mensagem quando não há resultados -->
      <v-sheet v-else class="text-center pa-6">
        <v-icon size="64" color="grey">mdi-movie-off</v-icon>
        <p class="text-h6 mt-4">Nenhum filme encontrado</p>
      </v-sheet>

      <!-- Paginação -->
      <div v-if="movies.length > 0" class="text-center mt-6">
        <v-pagination v-model="page" :length="totalPages" :total-visible="5"
          @update:model-value="changePage"></v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import SearchBar from '../components/SearchBar.vue';
import MovieFilter from '../components/MovieFilter.vue';
import MovieCard from '../components/MovieCard.vue';

export default {
  name: 'MovieListView',

  components: {
    SearchBar,
    MovieFilter,
    MovieCard
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const movies = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const totalPages = ref(0);
    const totalResults = ref(0);
    const searchQuery = ref('');
    const filters = ref({
      genreId: null,
      year: null,
      rating: null
    });

    // Computed para verificar se há filtros ativos
    const activeFilters = computed(() => {
      return filters.value.genreId || filters.value.year || filters.value.rating;
    });

    // Inicialização
    onMounted(() => {
      // Verificar se há query params na URL
      const query = route.query.query;
      const pageParam = parseInt(route.query.page) || 1;

      page.value = pageParam;

      if (query) {
        searchQuery.value = query;
        searchMovies(query);
      } else {
        loadMovies();
      }
    });

    // Observar mudanças na rota
    watch(() => route.query, (newQuery) => {
      if (newQuery.query !== searchQuery.value) {
        searchQuery.value = newQuery.query || '';

        if (searchQuery.value) {
          searchMovies(searchQuery.value);
        } else {
          loadMovies();
        }
      }

      if (newQuery.page && parseInt(newQuery.page) !== page.value) {
        page.value = parseInt(newQuery.page) || 1;
      }
    });

    // Carregar filmes populares ou filtrados
    const loadMovies = async () => {
      loading.value = true;

      try {
        let response;

        // Filtra por gênero se houver um selecionado
        if (filters.value.genreId) {
          response = await api.getMoviesByGenre(filters.value.genreId, page.value);
        } else {
          response = await api.getPopularMovies(page.value);
        }

        if (response && response.results) {
          // Aplicar filtros de ano e nota
          let filteredResults = response.results;

          if (filters.value.year) {
            filteredResults = filteredResults.filter(movie =>
              movie.release_date &&
              new Date(movie.release_date).getFullYear() === filters.value.year
            );
          }

          if (filters.value.rating) {
            filteredResults = filteredResults.filter(movie =>
              movie.vote_average >= filters.value.rating
            );
          }

          movies.value = filteredResults;
          totalPages.value = response.total_pages > 500 ? 500 : response.total_pages;
          totalResults.value = activeFilters.value ? filteredResults.length : response.total_results;
        }
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      } finally {
        loading.value = false;
      }
    };

    // Buscar filmes
    const searchMovies = async (query) => {
      if (!query.trim()) {
        resetSearch();
        return;
      }

      loading.value = true;
      searchQuery.value = query;

      try {
        const response = await api.searchMovies(query, page.value, filters.value.year);

        if (response && response.results) {
          movies.value = response.results;
          totalPages.value = response.total_pages > 500 ? 500 : response.total_pages;
          totalResults.value = response.total_results;

          // Atualizar URL com parâmetros de busca
          router.push({
            name: 'movieList',
            query: { query, page: page.value }
          });
        }
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      } finally {
        loading.value = false;
      }
    };

    // Aplicar filtros
    const applyFilters = (newFilters) => {
      filters.value = { ...newFilters };
      page.value = 1;

      // Resetar busca se houver filtros
      if (activeFilters.value) {
        searchQuery.value = '';
        router.push({ name: 'movieList', query: { page: page.value } });
      }

      loadMovies();
    };

    // Mudar página
    const changePage = (newPage) => {
      page.value = newPage;

      const query = { page: newPage };
      if (searchQuery.value) {
        query.query = searchQuery.value;
      }

      router.push({ name: 'movieList', query });

      if (searchQuery.value) {
        searchMovies(searchQuery.value);
      } else {
        loadMovies();
      }
    };

    // Limpar busca e filtros
    const resetSearch = () => {
      searchQuery.value = '';
      page.value = 1;

      router.push({ name: 'movieList' });
      loadMovies();
    };

    return {
      movies,
      loading,
      page,
      totalPages,
      totalResults,
      searchQuery,
      activeFilters,
      searchMovies,
      applyFilters,
      changePage,
      resetSearch
    };
  }
}
</script>