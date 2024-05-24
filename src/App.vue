<!-- App.vue -->
<template>
  <Home />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Home from './components/pages/Home.vue';

export default defineComponent({
  name: 'App',
  components: {
    Home
  }
});
</script>

<style>
/* Estilos do componente */
</style>
