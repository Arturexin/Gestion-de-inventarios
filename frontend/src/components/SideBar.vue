<script setup>
    import { navigationSideBar } from '../services/navigationSideBar.js';
    import { RouterLink, useRoute } from 'vue-router';

    const route = useRoute();

</script>

<template>
    <div class="sideBar">
        <div>
            <h2>Karpovick</h2>
        </div>
        <div v-for="item in navigationSideBar" :key="item.id" class="contenedor-item">
            <RouterLink
                :to="{ name: item.nombre }"
                class="item-estilo"
                :class="{ 'router-link-active': route.name === item.nombre }"
                :style="{ '--item-color': `var(${item.color})` }"
            >
                <span 
                    class="material-symbols-outlined" 
                    :style="{ color: `var(${item.color})` }"
                >
                    {{ item.icon }}
                </span>
                <p>{{ item.titulo }}</p>
            </RouterLink>
        </div>
        <div>
            <h3>Ayuda</h3>
        </div>
    </div>
    </template>

<style scoped>
p{
    margin: 1px;
}
.sideBar {
    display: grid;
    background: var(--fondo-primero);
    padding: 1em;
    min-height: 95vh;
    gap: 5px;
}
.contenedor-item{
    display: flex;
    justify-content: space-between;
}
.item-estilo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #eee;
    text-decoration: none;
    padding: 2px 5px;
    width: 100%;
    transition: background-color 0.3s ease; /* Transiciones suaves */
}
.item-estilo:hover {
  background: #686868; /* Color cuando se pasa el ratón por encima */
}
.material-symbols-outlined {
  padding: 5px;
  border-radius: 5px;
}
.item-estilo.router-link-active {
  background: linear-gradient(135deg, var(--fondo-primero) 20%, var(--item-color) 80%); /* Color cuando está activo */
}
</style>