<script setup>
  import { ref } from 'vue'; 
  import { useModalStore } from '../../stores/modalStore';
  import FormBusqueda from '../../components/forms/FormBusqueda.vue';
  import FormIngresar from '../../components/forms/FormIngresar.vue';
  import FormBusDetal from '../../components/forms/FormBusDetal.vue';
  import TabMoReg from '../../components/modal/TabMoReg.vue';
  import TabMoMod from '../../components/modal/TabMoMod.vue';
  import TabPrMod from '../../components/tables/TabPrMod.vue';

  //states
  const showFormBusqueda = ref(false);
  const showFormIngresar = ref(true);

  const modalStore = useModalStore();

  //methods
  function handleRegistroClick(){
    showFormBusqueda.value = false;
    showFormIngresar.value = true;
    modalStore.eliminarModal('showModalF');
  }
  function handleModificacionClick(){
    showFormIngresar.value = false;
    showFormBusqueda.value = true;
    modalStore.eliminarModal('showModalE');
  }
  function aperturarModalE(){
    modalStore.crearModal('showModalE')
  }
  function aperturarModalF(){
    modalStore.crearModal('showModalF')
  }
</script>

<template>
  <div class="contenedor-formularios">
    <div class="botones">
      <button class="btnUno" @click="handleRegistroClick()">Registrar</button>
      <button class="btnUno" @click="handleModificacionClick()">Modificar</button>
    </div>
    <div v-if="showFormIngresar" class="contenedor-formularios">
      <div class="contenedor-formularios-into">
        <form-ingresar 
          titulo="Registrar nuevo producto" 
          :clickFuncion="aperturarModalE"
        />
        <form-bus-detal />
      </div>
      <div v-if="modalStore.showModalE">
        <tab-mo-reg titulo="Pre lista de registro" />
      </div>
      <tab-pr-mod titulo="Lista de registro" />
    </div>
    <div v-if="showFormBusqueda" class="contenedor-formularios">
      <div class="contenedor-formularios-into">
        <form-busqueda 
          titulo="Modificar Producto" 
          :clickFuncion="aperturarModalF"
          />
        <form-bus-detal />
      </div>
      <div v-if="modalStore.showModalF">
        <tab-mo-mod titulo="Pre lista de modificación" />
      </div>
      <tab-pr-mod titulo="Lista de modificación" />
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