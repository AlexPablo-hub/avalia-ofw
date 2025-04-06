// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createStore } from 'vuex'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Configuração do Vuetify com tema escuro
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#121212'
        }
      }
    }
  }
})

// Criação da store do Vuex
const store = createStore({
  state() {
    return {
      userProfile: JSON.parse(localStorage.getItem('userProfile')) || null,
      favorites: JSON.parse(localStorage.getItem('favorites')) || []
    }
  },
  mutations: {
    setUserProfile(state, profile) {
      state.userProfile = profile
      localStorage.setItem('userProfile', JSON.stringify(profile))
    },
    addFavorite(state, movie) {
      if (!state.favorites.some(f => f.id === movie.id)) {
        state.favorites.push(movie)
        localStorage.setItem('favorites', JSON.stringify(state.favorites))
      }
    },
    removeFavorite(state, movieId) {
      state.favorites = state.favorites.filter(f => f.id !== movieId)
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    }
  },
  getters: {
    isFavorite: (state) => (movieId) => {
      return state.favorites.some(movie => movie.id === movieId)
    }
  }
})

// Criação do app Vue
const app = createApp(App)
app.use(router)
app.use(store)
app.use(vuetify)
app.mount('#app')