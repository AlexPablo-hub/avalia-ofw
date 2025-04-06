// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieListView from '../views/MovieListView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import NewsView from '../views/NewsView.vue'

// Importando os componentes de visualização
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'CineInfo - Home' }
  },
  {
    path: '/filmes',
    name: 'movieList',
    component: MovieListView,
    meta: { title: 'CineInfo - Lista de Filmes' }
  },
  {
    path: '/filme/:id',
    name: 'movieDetail',
    component: MovieDetailView,
    meta: { title: 'CineInfo - Detalhes do Filme' }
  },
  {
    path: '/noticias',
    name: 'news',
    component: NewsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Atualiza o título da página
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'CineInfo'
  next()
})

export default router