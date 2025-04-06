<!-- src/views/NewsView.vue -->
<template>
  <div>
    <v-sheet class="mb-6" elevation="0" color="transparent">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6">
          <h1 class="text-h4 font-weight-bold mb-0">Notícias de Cinema</h1>
          <p class="text-subtitle-1 text-white text-medium-emphasis mt-2">
            Descubra as últimas novidades do universo cinematográfico! Acompanhe lançamentos imperdíveis, bastidores de
            grandes produções, premiações, curiosidades sobre seus atores favoritos e tudo que acontece nas telonas e
            nos streamings. Fique por dentro das tendências, gêneros em alta e experiências que tornam o cinema uma arte
            que encanta gerações.
          </p>
        </v-col>

        <v-col cols="12" md="6" class="text-md-end">
          <v-chip-group v-model="selectedCategory" selected-class="bg-primary text-white" column>
            <v-chip v-for="category in categories" :key="category" filter variant="outlined"
              @click="filterByCategory(category)">
              {{ category }}
            </v-chip>
            <v-chip filter variant="outlined" @click="clearFilters">
              Todos
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Loading indicator -->
    <v-row v-if="loading">
      <v-col cols="12" sm="6" md="4" v-for="n in 9" :key="n">
        <v-skeleton-loader type="card" height="250" />
      </v-col>
    </v-row>

    <!-- Notícias -->
    <div v-else>
      <!-- Notícias em destaque -->
      <div v-if="!selectedCategory && featuredNews" class="mb-8">
        <h2 class="text-h5 mb-4">Em Destaque</h2>
        <v-card class="featured-news-card">
          <v-row no-gutters>
            <v-col cols="12" md="7">
              <v-img :src="getImageUrl(featuredNews.backdrop_path, 'w780')" height="400" cover class="rounded-s-lg">
                <template v-slot:placeholder>
                  <v-row class="fill-height" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <v-card-item>
                <v-chip size="small" color="primary" class="mb-2">
                  {{ featuredNews.category }}
                </v-chip>
                <v-card-title class="text-h4 mb-2">
                  {{ featuredNews.title }}
                </v-card-title>
                <v-card-subtitle class="mb-2">
                  {{ formatDate(featuredNews.release_date) }}
                </v-card-subtitle>
              </v-card-item>

              <v-card-text class="text-body-1 flex-grow-1">
                {{ featuredNews.overview }}
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-btn color="primary" variant="tonal" :to="`/filme/${featuredNews.id}`">
                  Ler Mais
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon variant="text">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
                <v-btn icon variant="text">
                  <v-icon>mdi-bookmark-outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- Lista de notícias -->
      <div class="mb-4">
        <h2 class="text-h5 mb-4">{{ selectedCategory || 'Todas as Notícias' }}</h2>
        <v-row>
          <v-col v-for="item in filteredNewsItems" :key="item.id" cols="12" sm="6" md="4">
            <v-card class="news-card h-100" @click="openNewsItem(item)">
              <v-img :src="getImageUrl(item.backdrop_path || item.poster_path)" height="200" cover class="news-image">
                <template v-slot:placeholder>
                  <v-row class="fill-height" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>

              <v-card-title class="pt-4 pb-1">
                {{ item.title }}
              </v-card-title>

              <v-card-subtitle class="pb-1 pt-0">
                {{ formatDate(item.release_date) }}
              </v-card-subtitle>

              <v-card-text class="text-body-2 pt-0">
                {{ truncateText(item.overview, 120) }}
              </v-card-text>

              <v-card-actions>
                <v-chip size="small" color="primary" variant="outlined" class="text-caption">
                  {{ item.category }}
                </v-chip>
                <v-spacer></v-spacer>
                <v-btn density="compact" icon variant="text">
                  <v-icon>mdi-share-variant</v-icon>
                </v-btn>
                <v-btn density="compact" icon variant="text">
                  <v-icon>mdi-bookmark-outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Paginação -->
      <div class="text-center mt-6">
        <v-pagination v-model="page" :length="totalPages" @update:model-value="changePage" rounded
          color="primary"></v-pagination>
      </div>
    </div>

    <!-- Estado vazio -->
    <v-alert v-if="!loading && filteredNewsItems.length === 0" type="info"
      text="Não há notícias disponíveis para os filtros selecionados." variant="tonal" class="mt-4"></v-alert>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

export default {
  name: 'NewsView',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const newsItems = ref([]);
    const featuredNews = ref(null);
    const loading = ref(true);
    const page = ref(1);
    const totalPages = ref(5); // Simulando múltiplas páginas
    const itemsPerPage = 9;
    const categories = ['Lançamentos', 'Próximos Filmes', 'Em Cartaz', 'Premiações', 'Entrevistas'];
    const selectedCategory = ref(null);

    // Função para obter filmes em cartaz (Now Playing)
    const getNowPlayingMovies = (page = 1) => {
      return fetch(`https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=${page}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
    };

    // Função para obter filmes próximos (Upcoming)
    const getUpcomingMovies = (page = 1) => {
      return fetch(`https://api.themoviedb.org/3/movie/upcoming?language=pt-BR&page=${page}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
    };

    // Função para obter filmes populares
    const getPopularMovies = (page = 1) => {
      return fetch(`https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${page}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
    };

    // Função para obter filmes top rated
    const getTopRatedMovies = (page = 1) => {
      return fetch(`https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=${page}`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
    };

    // Carrega as notícias
    const loadNews = async (pageNum = 1) => {
      loading.value = true;

      try {
        // Carregar dados de diferentes endpoints para simular categorias de notícias
        const [upcomingResponse, nowPlayingResponse, popularResponse, topRatedResponse] = await Promise.all([
          getUpcomingMovies(pageNum),
          getNowPlayingMovies(pageNum),
          getPopularMovies(pageNum),
          getTopRatedMovies(pageNum)
        ]);

        // Mapear as diferentes fontes de dados para categorias
        const categorizedData = [
          ...upcomingResponse.results.map(item => ({ ...item, category: 'Próximos Filmes' })),
          ...nowPlayingResponse.results.map(item => ({ ...item, category: 'Em Cartaz' })),
          ...popularResponse.results.map(item => ({ ...item, category: 'Lançamentos' })),
          ...topRatedResponse.results.slice(0, 5).map(item => ({ ...item, category: 'Premiações' })),
          ...topRatedResponse.results.slice(5, 10).map(item => ({ ...item, category: 'Entrevistas' }))
        ];

        // Filtrar apenas itens com imagem e descrição
        const filteredData = categorizedData.filter(item => item.backdrop_path && item.overview);

        // Definir notícia em destaque e remover da lista principal
        if (pageNum === 1 && !selectedCategory.value) {
          const featuredIndex = Math.floor(Math.random() * 5);
          featuredNews.value = filteredData[featuredIndex];

          // Remover o item em destaque da lista principal
          const mainNews = [...filteredData];
          mainNews.splice(featuredIndex, 1);
          newsItems.value = mainNews;
        } else {
          newsItems.value = filteredData;
        }

        // Calcular número total de páginas (simulado)
        totalPages.value = 5;
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        loading.value = false;
      }
    };

    // Filtrar por categoria
    const filterByCategory = (category) => {
      selectedCategory.value = category;
      page.value = 1;

      // Atualizar a URL para refletir o filtro
      router.push({
        path: route.path,
        query: { category: category, page: 1 }
      });
    };

    // Limpar filtros
    const clearFilters = () => {
      selectedCategory.value = null;
      page.value = 1;

      // Remover parâmetros de query da URL
      router.push({ path: route.path });

      // Recarregar notícias para mostrar o item em destaque novamente
      loadNews(1);
    };

    // Mudar de página
    const changePage = (newPage) => {
      page.value = newPage;

      // Atualizar URL com nova página
      const query = { page: newPage };
      if (selectedCategory.value) {
        query.category = selectedCategory.value;
      }

      router.push({ path: route.path, query });
      loadNews(newPage);
    };

    // Filtrar notícias com base na categoria selecionada
    const filteredNewsItems = computed(() => {
      if (!selectedCategory.value) return newsItems.value;
      return newsItems.value.filter(item => item.category === selectedCategory.value);
    });

    // Trunca texto para evitar overflow
    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Formata a data para exibição
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    };

    // Obtém a URL completa da imagem
    const getImageUrl = (path, size = 'w500') => {
      return path ? api.getImageUrl(path, size) : '/placeholder-image.jpg';
    };

    // Navegar para detalhes da notícia
    const openNewsItem = (item) => {
      router.push(`/filme/${item.id}`);
    };

    // Carregar notícias ao montar o componente
    onMounted(() => {
      // Verificar se há filtros na URL
      if (route.query.category) {
        selectedCategory.value = route.query.category;
      }

      if (route.query.page) {
        page.value = parseInt(route.query.page) || 1;
      }

      loadNews(page.value);
    });

    // Assistir a mudanças no filtro de categoria
    watch(selectedCategory, () => {
      if (page.value !== 1) {
        page.value = 1;
      }
    });

    return {
      newsItems,
      featuredNews,
      loading,
      page,
      totalPages,
      categories,
      selectedCategory,
      filteredNewsItems,
      truncateText,
      formatDate,
      getImageUrl,
      openNewsItem,
      filterByCategory,
      clearFilters,
      changePage
    };
  }
};
</script>

<style scoped>
.news-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

.news-image {
  position: relative;
}

.news-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
}

.featured-news-card {
  transition: box-shadow 0.2s;
}

.featured-news-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}
</style>