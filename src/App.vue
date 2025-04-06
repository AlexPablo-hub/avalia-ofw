<!-- src/App.vue -->
<template>
  <v-app>
    <Header />

    <v-main class="flex-grow-1">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Header from '@/components/AppHeader.vue'
import Footer from '@/components/AppFooter.vue'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style>
/* Fonte global para toda a aplicação */
html,
body {
  font-family: 'Inter', sans-serif !important;
}

/* Aplicando o background na v-app */
.v-application {
  font-family: 'Inter', sans-serif !important;
  background-image: url('@/assets/background.png') !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
}

/* Deixar o app transparente para mostrar o background */
.v-app {
  background: transparent !important;
}

/* Estilos para o Header */
[class^="text-"],
.v-btn,
.v-card,
.v-alert,
.v-toolbar,
.v-app-bar {
  font-family: 'Inter', sans-serif !important;
}

/* Estilos para o app */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Estilos para o v-main */
.v-main {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  background: transparent !important;
}

/* Estilos para o conteúdo */
.v-main>.v-container {
  flex-grow: 1;
  background: transparent !important;
}

/* Estilos para o footer */
.v-footer {
  background: transparent !important;
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