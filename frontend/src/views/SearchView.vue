<script setup>
import { onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  // service
  import { listaBlog } from '../services/blogServices';

  const route = useRoute();
  
  const listResults = computed(() => {
    return listaBlog.filter((item) => {
      return item.titulo.includes(route.query.kword);
    });
  });

  onMounted(() => {
    console.log('BlogView mounted --> ', 
      route.query.kword);
  });
</script>

<template>
  <div>
    <h3>Bolgs encontrados</h3>
    <p v-for="res in listResults">
      {{ res.titulo }}
    </p>
  </div>
</template>

<style scoped>
</style>