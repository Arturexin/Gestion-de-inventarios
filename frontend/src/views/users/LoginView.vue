<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  //states
  const router = useRouter();
  const loading = ref(false);
  function login(){
    localStorage.setItem('isAuth', true);
    loading.value = true;
    setTimeout(() => {
      router.push({name: 'user-perfil'});
      loading.value = false;
    }, 1000);
  }

</script>

<template>
  <div>
    <h1>Ingresar al sistema</h1>
    <button @click="login()">Acceder</button>
    <p v-if="loading">...accediendo</p>
  </div>
</template>

<style scoped>


</style>