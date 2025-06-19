<script setup>
  import { RouterLink, useRouter } from 'vue-router';
  import { ref } from 'vue';

  const router = useRouter();
  const kword = ref('');

  function buscarBlog() {
    router.push({name: 'search-blog', query: {kword: kword.value}});
  }

</script>

<template>
        <div class="navBar-into">
            <div>
                <input 
                type="text" 
                placeholder="Buscar" 
                v-model="kword"/>
                <button @click="buscarBlog()">Buscar</button>
            </div>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink :to="{name: 'about'}">About</RouterLink>
            <RouterLink :to="{name: 'blog'}">Blog</RouterLink>
            <RouterLink :to="{name: 'login'}">Acceder</RouterLink>
        </div>
</template>

<style scoped>
.navBar-into{
    display: flex;
    justify-content: space-between;
    background: var(--fondo-primero);
    padding: 1em;
}
</style>