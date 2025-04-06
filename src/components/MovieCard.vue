<!-- src/components/MovieCard.vue -->
<template>
  <v-card class="movie-card ma-2" :to="{ name: 'movieDetail', params: { id: movie.id } }" elevation="4" height="100%">
    <v-img :src="posterUrl" :alt="movie.title" height="300" cover class="align-end"
      :gradient="'to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 80%'">
      <v-card-title class="text-white">{{ movie.title }}</v-card-title>
    </v-img>

    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-rating v-model="rating" color="amber" density="compact" size="small" readonly half-increments></v-rating>
        <span class="ml-2 text-subtitle-2">{{ movie.vote_average.toFixed(1) }}</span>
      </div>
      <p class="text-truncate">{{ formatDate(movie.release_date) }}</p>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <favorite-button :movie-id="movie.id" :movie="movie"></favorite-button>
      <v-btn variant="outlined" color="primary" class="mr-6" :to="{ name: 'movieDetail', params: { id: movie.id } }">
        Ver Detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import api from '../services/api';
import FavoriteButton from './FavoriteButton.vue';

export default {
  name: 'MovieCard',

  components: {
    FavoriteButton
  },

  props: {
    movie: {
      type: Object,
      required: true
    }
  },

  computed: {
    posterUrl() {
      return this.movie.poster_path
        ? api.getImageUrl(this.movie.poster_path)
        : '/img/no-poster.png';
    },

    rating() {
      return this.movie.vote_average / 2;
    }
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Data desconhecida';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
  }
}
</script>


<style scoped>
.movie-card {
  transition: transform 0.3s;
}

.movie-card:hover {
  transform: translateY(-5px);
}
</style>