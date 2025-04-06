<template>
    <v-footer class="text-white pa-6">
      <v-container>
        <v-row>
          <!-- Logo + Descrição -->
          <v-col cols="12" md="6">
            <h4 class="text-h6 font-weight-bold">
              Cine<span class="text-yellow-darken-3">Info</span>
            </h4>
            <p class="mb-2">
              Explore o universo do cinema com notícias, trailers, avaliações e muito mais. Um projeto desenvolvido por apaixonados por filmes.
            </p>
            <p class="text-caption">
              Dados e imagens fornecidos por
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                class="text-white text-decoration-underline"
                >TMDB</a
              >.
            </p>
          </v-col>
  
          <!-- Redes sociais -->
          <v-col cols="12" md="6" class="text-md-end mt-4 mt-md-0">
            <p class="text-subtitle-2 mb-2">Nos siga nas redes:</p>
            <v-btn
              icon
              class="mx-1"
              variant="text"
              color="white"
              href="https://github.com/AlexPablo-hub"
              target="_blank"
            >
              <v-icon>mdi-github</v-icon>
            </v-btn>
            <v-btn
              icon
              class="mx-1"
              variant="text"
              color="white"
              href="https://www.instagram.com/alex_p.oliveira/"
              target="_blank"
            >
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn
              icon
              class="mx-1"
              variant="text"
              color="white"
              href="https://www.linkedin.com/in/alex-pablo-d-4961a9141/"
              target="_blank"
            >
              <v-icon>mdi-linkedin</v-icon>
            </v-btn>
            <v-btn
              icon
              class="mx-1"
              variant="text"
              color="white"
              href="https://twitter.com/"
              target="_blank"
            >
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn
              icon
              class="mx-1"
              variant="text"
              color="white"
              href="https://www.facebook.com/alexpablo.deoliveiramoraes"
              target="_blank"
            >
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <p class="text-caption mt-4">
              © {{ new Date().getFullYear() }} Alex Pablo - Todos os direitos reservados.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script>
  export default {
    name: 'Footer'
  }
  </script>
  
  <style scoped>
  .text-yellow-darken-3 {
    color: #fbc02d;
  }
  </style>