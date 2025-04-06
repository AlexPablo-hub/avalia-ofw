<!-- src/components/NewsSection.vue -->
<template>
  <div class="news-section my-8">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 font-weight-bold mb-0">Notícias de Cinema</h2>
      <v-btn variant="text" color="primary" @click="showAllNews">
        Ler mais
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </div>

    <v-row v-if="loading">
      <v-col cols="12" sm="6" md="3" v-for="n in 4" :key="n">
        <v-skeleton-loader type="card" height="200" />
      </v-col>
    </v-row>

    <v-row v-else-if="newsItems.length > 0">
      <v-col v-for="item in newsItems.slice(0, 4)" :key="item.id" cols="12" sm="6" md="3">
        <v-card class="news-card h-100" @click="openNewsItem(item)">
          <v-img :src="getImageUrl(item.backdrop_path || item.poster_path)" height="150" cover class="news-image">
            <template v-slot:placeholder>
              <v-row class="fill-height" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>

          <v-card-title class="pt-3 pb-1 text-subtitle-1">
            {{ truncateText(item.title, 40) }}
          </v-card-title>

          <v-card-subtitle class="pb-1 pt-0">
            {{ formatDate(item.release_date) }}
          </v-card-subtitle>

          <v-card-text class="text-body-2 pt-0">
            {{ truncateText(item.overview, 80) }}
          </v-card-text>

          <v-card-actions>
            <v-chip size="small" color="primary" variant="outlined" class="text-caption">
              {{ getNewsCategory(item) }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn density="compact" icon variant="text">
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" text="Não há notícias disponíveis no momento." variant="tonal"></v-alert>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../services/api';

export default {
  name: 'NewsSection',

  setup() {
    const newsItems = ref([]);
    const loading = ref(true);
    const categories = ['Lançamentos', 'Próximos Filmes', 'Em Cartaz', 'Premiações'];

    // Função para obter filmes em cartaz (Now Playing)
    const getNowPlayingMovies = () => {
      return fetch(`https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
    };

    // Função para obter filmes próximos (Upcoming)
    const getUpcomingMovies = () => {
      return fetch(`https://api.themoviedb.org/3/movie/upcoming?language=pt-BR&page=1`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
          'Content-Type': 'application/json'
        }
      }).then(response => response.json());
    };

    // Carrega as "notícias" - usando filmes próximos e em cartaz como fonte de dados
    onMounted(async () => {
      try {
        // Carregar filmes em cartaz e próximos lançamentos
        const [upcomingResponse, nowPlayingResponse] = await Promise.all([
          getUpcomingMovies(),
          getNowPlayingMovies()
        ]);

        // Combinar e filtrar os resultados
        const combinedResults = [
          ...upcomingResponse.results,
          ...nowPlayingResponse.results
        ]
          .filter(item => item.backdrop_path && item.overview)
          .slice(0, 8);

        // Adicionar um marcador de categoria para cada notícia
        newsItems.value = combinedResults.map(item => ({
          ...item,
          category: categories[Math.floor(Math.random() * categories.length)]
        }));
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        loading.value = false;
      }
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
    const getImageUrl = (path) => {
      return path ? api.getImageUrl(path, 'w342') : '/placeholder-image.jpg';
    };

    // Obtém categoria da notícia
    const getNewsCategory = (item) => {
      return item.category || 'Novidades';
    };

    // Navegar para página completa da notícia
    const openNewsItem = (item) => {
      // Aqui poderia navegar para uma página de detalhes da notícia
      // Por enquanto, vamos para o detalhe do filme
      window.location.href = `/filme/${item.id}`;
    };

    // Navegar para página com todas as notícias
    const showAllNews = () => {
      window.location.href = "/noticias";
    };

    return {
      newsItems,
      loading,
      truncateText,
      formatDate,
      getImageUrl,
      getNewsCategory,
      openNewsItem,
      showAllNews
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
</style>