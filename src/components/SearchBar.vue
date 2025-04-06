<template>
  <v-form @submit.prevent="search">
    <v-container fluid class="pa-0">
      <v-row align="center" justify="end">
        <v-col cols="12" sm="6">
          <v-text-field v-model="searchQuery" label="Busque por um filme" variant="outlined" clearable hide-details
            density="comfortable" class="rounded-xl elevation-1" @keyup.enter="search" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'SearchBar',

  data() {
    return {
      searchQuery: '',
      isLoading: false
    };
  },

  methods: {
    search() {
      if (!this.searchQuery.trim()) return;

      this.isLoading = true;
      this.$emit('search', this.searchQuery);

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  }
};
</script>
