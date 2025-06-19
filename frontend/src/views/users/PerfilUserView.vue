<script setup>
    import { useRouter } from 'vue-router';
    //states
    const router = useRouter();
    //methods
    function logout() {
        localStorage.setItem('isAuth', false);
        router.replace({name: 'login'});//no se guarda en el historial a diferencia de push
    }
</script>

<template>
  <div>
    <h1>Bienvenido al perfil!!</h1>
    <button @click="logout()">Cerrar sesión</button>
  </div>
</template>

<style scoped>


</style>