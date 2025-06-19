<script setup>
  import { useRoute } from 'vue-router';
  import { ref, onMounted, watch } from 'vue';
  import { getBlogById } from '../services/blogServices.js';

  //state
  const route = useRoute();//nos permite usar datos del html
  const blogRetrive = ref(getBlogById(1));
  //watch
  watch(() => route.params.id, (newId, oldId) => {
    blogRetrive.value = getBlogById(route.params.id);
  });
  //methods
  onMounted(() => {
    blogRetrive.value = getBlogById(route.params.id);
  });

</script>

<template>
  <div>
    <h1>Entrada del blog</h1>
    <div>
        <p>id: {{ $route.params.id }}</p>
        <h3>Titulo: {{ blogRetrive.titulo }}</h3>
        <p>Contenido: {{ blogRetrive.contenido }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>