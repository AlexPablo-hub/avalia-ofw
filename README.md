# CineInfo 🎬

**CineInfo** é uma aplicação web construída com Vue.js e Vuetify, que permite explorar o universo cinematográfico com estilo e interatividade. A plataforma exibe filmes populares, permite salvar favoritos, visualizar detalhes e acompanhar as tendências do momento, tudo com uma interface responsiva e moderna.

---
## 🚀 Funcionalidades

- 🎥 Listagem de filmes populares e em alta (Trending)
- 🔍 Busca de filmes por título
- ⭐ Adição e remoção de filmes favoritos (persistência via `localStorage`)
- 📅 Noticias do mundo do cinema
- 🎭 Filtros por gênero, ano e nota

---
## 🛠️ Tecnologias Utilizadas

- [Vue 3](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/) - Gerenciamento de estado global
- [Vue Router](https://router.vuejs.org/)
- [Vuetify 3](https://next.vuetifyjs.com/) - Biblioteca de componentes UI
- [TMDB API](https://www.themoviedb.org/documentation/api) - Fonte dos dados dos filmes
- [Axios](https://axios-http.com/) - Requisições HTTP

---
## 📂 Estrutura do Projeto

```bash
# Estrutura de pastas do projeto
cineinfo/
├── src/
│   ├── assets/
│   │   ├── background.png
│   │   └── filme.png
│   ├── components/
│   │   ├── AppFooter.vue
│   │   ├── AppHeader.vue
│   │   ├── FavoriteButton.vue
│   │   ├── MovieCard.vue
│   │   ├── MovieCarousel.vue
│   │   ├── MovieFilter.vue
│   │   ├── NewsSection.vue
│   │   └── SearchBar.vue
│   ├── plugins/
│   │   └── vuetify.js
│   ├── router/
│   │   └── index.js
│   ├── services/
│   │   └── api.js
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── MovieListView.vue
│   │   ├── MovieDetailView.vue
│   │   └── NewsView.vue
│   ├── App.vue
│   └── main.js
├── .env
├── index.html
├── package.json
└── vite.config.js
```

---
## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/AlexPablo-hub/cineinfo.git
cd cineinfo
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto e adicione sua API KEY da TMDB:

```env
VITE_TMDB_BEARER=your_tmdb_api_key_here
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```
Acesse `http://localhost:5173` no navegador.

---

## 👤 Desenvolvedor

### Alex Pablo de Oliveira Moraes 

[GitHub](https://github.com/AlexPablo-hub) · [LinkedIn](https://www.linkedin.com/in/alex-pablo-d-4961a9141/) · [Instagram](https://instagram.com/alex_p.oliveira/)

**CineInfo** é um projeto pessoal com fins educativos, sem fins lucrativos. Todos os dados e imagens são fornecidos pela [TMDB](https://www.themoviedb.org/).
