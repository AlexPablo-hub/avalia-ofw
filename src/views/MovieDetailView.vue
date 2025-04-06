<!-- src/views/MovieDetailView.vue -->
<template>
  <div>
    <!-- Loading indicator -->
    <v-sheet v-if="loading" class="text-center pa-6">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-sheet>

    <!-- Erro ao carregar filme -->
    <v-alert v-else-if="error" type="error"
      text="Ocorreu um erro ao carregar os detalhes do filme. Por favor, tente novamente mais tarde."
      class="mb-4"></v-alert>

    <!-- Detalhes do filme -->
    <div v-else-if="movie">
      <!-- Backdrop e informações principais -->
      <div class="movie-backdrop mb-6" :style="{ backgroundImage: `url(${backdropUrl})` }">
        <v-container>
          <v-row class="backdrop-content">
            <v-col cols="12" sm="4" md="3">
              <v-img :src="posterUrl" :alt="movie.title" width="100%" max-height="450"
                class="movie-poster rounded"></v-img>
            </v-col>

            <v-col cols="12" sm="8" md="9">
              <div class="movie-info">
                <h1 class="text-h3 font-weight-bold">
                  {{ movie.title }}
                  <span class="text-h5 font-weight-regular" v-if="movie.release_date">
                    ({{ new Date(movie.release_date).getFullYear() }})
                  </span>
                </h1>

                <div class="d-flex align-center my-4">
                  <v-rating :model-value="movie.vote_average / 2" color="amber" half-increments readonly
                    size="small"></v-rating>

                  <span class="ml-2 text-h6">
                    {{ movie.vote_average.toFixed(1) }}/10
                  </span>

                  <v-divider vertical class="mx-3"></v-divider>

                  <span>{{ movie.vote_count }} votos</span>

                  <v-spacer></v-spacer>

                  <favorite-button :movie-id="movie.id" :movie="movie" :is-large="true"></favorite-button>
                </div>

                <div class="mb-4">
                  <v-chip v-for="genre in movie.genres" :key="genre.id" class="mr-2 mb-2" color="primary"
                    variant="outlined">
                    {{ genre.name }}
                  </v-chip>
                </div>

                <p class="text-subtitle-1 font-italic" v-if="movie.tagline">
                  "{{ movie.tagline }}"
                </p>

                <h2 class="text-h6 font-weight-bold mt-4">Sinopse</h2>
                <p class="text-body-1">
                  {{ movie.overview || 'Sinopse não disponível' }}
                </p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container>
        <v-row>
          <!-- Informações adicionais -->
          <v-col cols="12" md="8">
            <!-- Trailer -->
            <div v-if="trailerKey" class="mb-6">
              <h2 class="text-h5 mb-3">Trailer</h2>
              <v-responsive max-width="100%" class="mx-auto" aspect-ratio="16/9">
                <iframe :src="`https://www.youtube.com/embed/${trailerKey}`" frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen class="video-iframe"></iframe>
              </v-responsive>
            </div>

            <!-- Elenco -->
            <div v-if="cast.length > 0" class="mb-6">
              <h2 class="text-h5 mb-3">Elenco Principal</h2>
              <v-sheet class="overflow-x-auto">
                <div class="d-flex cast-list">
                  <v-card v-for="actor in cast.slice(0, 10)" :key="actor.id" width="150" class="mr-3 rounded"
                    elevation="2">
                    <v-img
                      :src="actor.profile_path ? api.getImageUrl(actor.profile_path, 'w185') : '/img/no-profile.png'"
                      :alt="actor.name" height="225" cover></v-img>

                    <v-card-text class="pa-2">
                      <p class="font-weight-bold mb-0 text-truncate">{{ actor.name }}</p>
                      <p class="text-caption text-truncate">{{ actor.character }}</p>
                    </v-card-text>
                  </v-card>
                </div>
              </v-sheet>
            </div>
          </v-col>

          <!-- Detalhes técnicos -->
          <v-col cols="12" md="4">
            <v-card class="mb-4">
              <v-card-title>Informações</v-card-title>
              <v-card-text>
                <v-list density="compact">
                  <v-list-item v-if="movie.release_date">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-calendar</v-icon>
                    </template>
                    <v-list-item-title>Data de Lançamento</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ new Date(movie.release_date).toLocaleDateString('pt-BR') }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="movie.runtime">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-clock-outline</v-icon>
                    </template>
                    <v-list-item-title>Duração</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ Math.floor(movie.runtime / 60) }}h {{ movie.runtime % 60 }}min
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="movie.budget">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-cash</v-icon>
                    </template>
                    <v-list-item-title>Orçamento</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatCurrency(movie.budget) }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="movie.revenue">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-cash-multiple</v-icon>
                    </template>
                    <v-list-item-title>Receita</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ formatCurrency(movie.revenue) }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="movie.production_companies && movie.production_companies.length">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-office-building</v-icon>
                    </template>
                    <v-list-item-title>Produtoras</v-list-item-title>
                    <v-list-item-subtitle>
                      {{movie.production_companies.map(company => company.name).join(', ')}}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item v-if="movie.original_language">
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-translate</v-icon>
                    </template>
                    <v-list-item-title>Idioma Original</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ getLanguageName(movie.original_language) }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Links externos -->
            <v-card v-if="movie.homepage" class="mb-4">
              <v-card-title>Links</v-card-title>
              <v-card-text>
                <v-btn :href="movie.homepage" target="_blank" color="primary" variant="outlined" block
                  prepend-icon="mdi-web">
                  Site Oficial
                </v-btn>

                <v-btn :href="`https://www.imdb.com/title/${movie.imdb_id}`" target="_blank" color="amber"
                  variant="outlined" block class="mt-2" prepend-icon="mdi-movie" v-if="movie.imdb_id">
                  IMDb
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Filme não encontrado -->
    <v-container v-else class="text-center pa-8">
      <v-icon size="64" color="grey">mdi-movie-off</v-icon>
      <h2 class="text-h5 mt-4">Filme não encontrado</h2>
      <v-btn color="primary" class="mt-4" :to="{ name: 'home' }">Voltar para a Home</v-btn>
    </v-container>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import FavoriteButton from '../components/FavoriteButton.vue';

export default {
  name: 'MovieDetailView',

  components: {
    FavoriteButton
  },

  setup() {
    const route = useRoute();
    const movie = ref(null);
    const loading = ref(true);
    const error = ref(false);
    const cast = ref([]);

    // URLs para imagens
    const posterUrl = computed(() => {
      return movie.value && movie.value.poster_path
        ? api.getImageUrl(movie.value.poster_path, 'w500')
        : '/img/no-poster.png';
    });

    const backdropUrl = computed(() => {
      return movie.value && movie.value.backdrop_path
        ? api.getImageUrl(movie.value.backdrop_path, 'original')
        : '';
    });

    // Trailer do YouTube
    const trailerKey = computed(() => {
      if (!movie.value || !movie.value.videos || !movie.value.videos.results) {
        return null;
      }

      const trailer = movie.value.videos.results.find(
        video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
      );

      return trailer ? trailer.key : null;
    });

    // Carregar detalhes do filme
    onMounted(async () => {
      const movieId = parseInt(route.params.id);

      if (!movieId) {
        loading.value = false;
        return;
      }

      try {
        const data = await api.getMovieDetails(movieId);

        if (data && data.id) {
          movie.value = data;

          // Extrair elenco
          if (data.credits && data.credits.cast) {
            cast.value = data.credits.cast;
          }
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes do filme:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    });

    // Formatar valores monetários
    const formatCurrency = (value) => {
      if (!value || value === 0) return 'Não informado';
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(value);
    };

    // Obter nome do idioma
    const getLanguageName = (code) => {
      const languages = {
        'en': 'Inglês',
        'es': 'Espanhol',
        'fr': 'Francês',
        'pt': 'Português',
        'it': 'Italiano',
        'de': 'Alemão',
        'ja': 'Japonês',
        'ko': 'Coreano',
        'zh': 'Chinês',
        'ru': 'Russo'
      };

      return languages[code] || code;
    };

    return {
      movie,
      loading,
      error,
      cast,
      posterUrl,
      backdropUrl,
      trailerKey,
      formatCurrency,
      getLanguageName,
      api
    };
  }
}
</script>

<style scoped>
.movie-backdrop {
  position: relative;
  background-size: cover;
  background-position: center;
  padding: 40px 0;
  color: white;
}

.movie-backdrop::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.9) 20%, rgba(0, 0, 0, 0.6) 80%);
  z-index: 1;
}

.backdrop-content {
  position: relative;
  z-index: 2;
}

.movie-poster {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.cast-list {
  padding-bottom: 16px;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>