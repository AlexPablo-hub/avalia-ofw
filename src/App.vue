<!-- src/App.vue -->
<template>
  <v-app flat color="transparent" class="bg-transparent">
    <Header @search="searchMovies" />
    
    <v-main style="background-color: transparent;">
      <v-container fluid style="background-color: transparent;">
        <router-view />
      </v-container>
    </v-main>
    
    <v-footer app class="text-center">
      <p class="ma-0">
        © {{ new Date().getFullYear() }} CineInfo - Dados e imagens fornecidos por 
        <a href="https://www.themoviedb.org/" target="_blank" class="text-decoration-none">TMDB</a>
      </p>
    </v-footer>
  </v-app>
</template>

<script>
import Header from '@/components/Header.vue'

  
export default {
  components: {
    Header
  },
  methods: {
    searchMovies(query) {
      // Aqui você pode acionar uma busca global ou redirecionar pra uma tela com resultados
      console.log('Buscando por:', query)
    }
  }
}
</script>

<style>
/* Fonte global para toda a aplicação */
html, body, .v-application{
  font-family: 'Inter', sans-serif !important;
  background-image: url('@/assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* Estilos para o Header */
[class^="text-"], .v-btn, .v-card, .v-alert, .v-toolbar, .v-app-bar {
  font-family: 'Inter', sans-serif !important;
}

/* Estilos globais */
.page-title {
  margin-bottom: 24px;
  font-weight: 600;
}

/* Animação para mudança de páginas */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

h2 {
  text-shadow: 2px 2px 5px rgb(0, 0, 0);
}
</style>
