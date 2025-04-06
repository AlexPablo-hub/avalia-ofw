<!-- src/components/FavoriteButton.vue -->
<template>
  <v-btn icon :color="isFavorite ? 'error' : undefined" @click.stop.prevent="toggleFavorite">
    <v-icon>
      {{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
    </v-icon>
  </v-btn>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';


export default {
  name: 'FavoriteButton',

  props: {
    movieId: {
      type: Number,
      required: true
    },
    movie: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const store = useStore();

    // Verifica se o filme está nos favoritos
    const isFavorite = computed(() => {
      return store.getters.isFavorite(props.movieId);
    });

    // Adiciona ou remove o filme dos favoritos
    const toggleFavorite = () => {
      if (isFavorite.value) {
        store.commit('removeFavorite', props.movieId);
      } else {
        store.commit('addFavorite', props.movie);
      }
    };

    return {
      isFavorite,
      toggleFavorite
    };
  }
}
</script>