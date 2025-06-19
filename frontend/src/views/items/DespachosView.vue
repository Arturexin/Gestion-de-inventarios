<script setup>
  import { useModalStore } from '../../stores/modalStore';
  import FormBusqueda from '../../components/forms/FormBusqueda.vue';
  import FormBusDetal from '../../components/forms/FormBusDetal.vue';
  import TabMoDesp from '../../components/modal/TabMoDesp.vue';
  import TabPrDesp from '../../components/tables/TabPrDesp.vue';

  //states

  const modalStore = useModalStore();

  function aperturarModalD(){
    modalStore.crearModal('showModalD')
  }
</script>

<template>
  <div class="contenedor-formularios">
    <div class="contenedor-formularios">
      <div class="contenedor-formularios-into">
        <form-busqueda 
          titulo="Despachos" 
          :clickFuncion="aperturarModalD"
        />
        <form-bus-detal />
      </div>
      <div v-if="modalStore.showModalD">
        <tab-mo-desp titulo="Pre lista de despacho" />
      </div>
      <tab-pr-desp titulo="Lista de despacho" />
    </div>
  </div>
</template>

<style scoped>

.botones{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  min-width: 1080px;
  padding: 10px;
  background: rgb(27 30 32);
}
</style>