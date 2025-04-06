<!-- src/components/AppHeader.vue -->
<template>
    <v-app-bar flat color="transparent" height="60" class="px-4 d-flex align-center">
        <!-- Esquerda: Logo + Navegação -->
        <div class="d-flex align-center">
            <v-btn to="/" variant="plain" class="nav-btn text-white text-h5 font-weight-bold mr-4">
                Cine<span class="text-yellow-darken-3">Info</span>
            </v-btn>
            <v-btn to="/" variant="plain" class="nav-btn text-white">
                Home
            </v-btn>
            <v-btn to="/filmes" variant="plain" class="nav-btn text-white">
                Filmes
            </v-btn>
            <v-btn to="/noticias" variant="plain" class="nav-btn text-white">
                Noticias
            </v-btn>
        </div>

        <v-spacer />

        <!-- Direita: container com largura definida -->
        <div class="d-flex align-center">
            <v-row align="center" no-gutters>
                <v-col cols="3" class="text-end">
                    <v-btn variant="plain" icon color="white" class="nav-btn ml-2" @click="mostrarAlerta">
                        <v-icon>mdi-account-circle</v-icon>
                    </v-btn>

                </v-col>
            </v-row>
        </div>
    </v-app-bar>
</template>

<script>
import SearchBar from './SearchBar.vue'

export default {
    name: 'Header',
    components: {
        SearchBar
    },
    methods: {
        emitSearch(query) {
            this.$emit('search', query)
        },
        mostrarAlerta() {
            window.alert('Funcionalidade não implementada, não deu tempo de fazer...😥');
        }
    }
}
</script>

<style>
.nav-btn {
    text-transform: none;
    opacity: 1 !important;
    /* força opacidade total */
    transition: transform 0.2s ease, color 0.2s ease;
    font-weight: 500;
    padding: 0 12px;
    min-width: unset;
}

.nav-btn:hover {
    transform: scale(1.09);
    opacity: 1 !important;
    color: #ffffff !important;
}
</style>
