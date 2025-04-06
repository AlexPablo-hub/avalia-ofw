// src/services/api.js
const BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Serviço para comunicação com a API do TMDB
 */
export default {
  /**
   * Obtém lista de filmes populares
   * @param {number} page - Número da página
   * @returns {Promise<Object>} - Retorna objeto com resultados e informações de paginação
   */
  getPopularMovies(page = 1) {
    return fetch(`${BASE_URL}/movie/popular?language=pt-BR&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  /**
   * Busca filmes por termo
   * @param {string} query - Termo de busca
   * @param {number} page - Número da página
   * @returns {Promise<Object>} - Retorna objeto com resultados e informações de paginação
   */
  searchMovies(query, page = 1, year = null) {
    let url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`;
    
    if (year) {
      url += `&year=${year}`;
    }
  
    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  /**
   * Obtém detalhes de um filme específico
   * @param {number} movieId - ID do filme
   * @returns {Promise<Object>} - Retorna objeto com detalhes do filme
   */
  getMovieDetails(movieId) {
    return fetch(`${BASE_URL}/movie/${movieId}?append_to_response=videos,credits&language=pt-BR`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  /**
   * Obtém lista de gêneros de filmes
   * @returns {Promise<Object>} - Retorna objeto com lista de gêneros
   */
  getGenres() {
    return fetch(`${BASE_URL}/genre/movie/list?language=pt-BR`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  /**
   * Obtém filmes por gênero
   * @param {number} genreId - ID do gênero
   * @param {number} page - Número da página
   * @returns {Promise<Object>} - Retorna objeto com resultados e informações de paginação
   */
  getMoviesByGenre(genreId, page = 1) {
    return fetch(`${BASE_URL}/discover/movie?with_genres=${genreId}&language=pt-BR&page=${page}`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
  },

  /**
   * Obtém URL completa para imagem
   * @param {string} path - Caminho parcial da imagem
   * @param {string} size - Tamanho da imagem (w92, w154, w185, w342, w500, w780, original)
   * @returns {string} - URL completa da imagem
   */
  getImageUrl(path, size = 'w500') {
    if (!path) return null;
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
}