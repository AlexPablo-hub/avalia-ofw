<!-- src/components/MovieCarousel.vue -->
<template>
  <div>
    <v-carousel cycle height="500" hide-delimiter-background show-arrows="hover" interval="5000">
      <v-carousel-item v-for="movie in movies" :key="movie.id" :src="getBackdropUrl(movie.backdrop_path)" cover>
        <div class="carousel-overlay d-flex flex-column justify-end pa-6">
          <h2 class="text-h4 font-weight-bold">{{ movie.title }}</h2>
          <div class="d-flex align-center my-2">
            <v-rating :model-value="movie.vote_average / 2" color="amber" density="compact" size="small" readonly
              half-increments></v-rating>
            <span class="ml-2">{{ movie.vote_average.toFixed(1) }}/10</span>
          </div>
          <p class="text-truncate-2 mb-4">{{ movie.overview }}</p>
          <div>
            <v-btn color="primary" variant="outlined" :to="{ name: 'movieDetail', params: { id: movie.id } }"
              class="mr-2">
              Ver Detalhes
            </v-btn>
            <favorite-button :movie-id="movie.id" :movie="movie"></favorite-button>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import api from '../services/api';
import FavoriteButton from './FavoriteButton.vue';

export default {
  name: 'MovieCarousel',

  components: {
    FavoriteButton
  },

  props: {
    movies: {
      type: Array,
      required: true
    }
  },

  methods: {
    getBackdropUrl(path) {
      return path ? api.getImageUrl(path, 'original') : '/img/no-backdrop.png';
    }
  }
}
</script>

<style scoped>
.carousel-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0) 100%);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  height: 100%;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>