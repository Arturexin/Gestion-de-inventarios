<script setup>
  import { useModalStore } from '../../stores/modalStore';
  import FormBusqueda from '../../components/forms/FormBusqueda.vue';
  import FormBusDetal from '../../components/forms/FormBusDetal.vue';
  import TabMoTransf from '../../components/modal/TabMoTransf.vue';
  import TabPrTransf from '../../components/tables/TabPrTransf.vue';

  //states

  const modalStore = useModalStore();


  function aperturarModalC(){
    modalStore.crearModal('showModalC')
  }
</script>

<template>
  <div class="contenedor-formularios">
    <div class="contenedor-formularios">
      <div class="contenedor-formularios-into">
        <form-busqueda 
          titulo="Transferencias" 
          :clickFuncion="aperturarModalC"
        />
        <form-bus-detal />
      </div>
      <div v-if="modalStore.showModalC">
        <tab-mo-transf titulo="Pre lista de transferencias" />
      </div>
      <tab-pr-transf titulo="Lista de transferencias" />
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