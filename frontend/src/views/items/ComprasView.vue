<script setup>
  import { ref } from 'vue'; 
  import { useModalStore } from '../../stores/modalStore';
  import { useDataBases } from '../../stores/dataBases';
  import FormBusqueda from '../../components/forms/FormBusqueda.vue';
  import FormIngresar from '../../components/forms/FormIngresar.vue';
  import TabPrCompra from '../../components/tables/TabPrCompra.vue';
  import FormBusDetal from '../../components/forms/FormBusDetal.vue';
  import TabMoCompra from '../../components/modal/TabMoCompra.vue';
  import TabModRecompra from '../../components/modal/TabModRecompra.vue';
  import DialMoMensajes from '../../components/modal/DialMoMensajes.vue';
  import FormCategorias from '../../components/forms/FormCategorias.vue';
  import TabPrintPr from '../../components/modal/TabPrintPr.vue';

  //states
  const showFormBusqueda = ref(false);
  const showFormIngresar = ref(true);

  const modalStore = useModalStore();
  const dbStore = useDataBases();

  //methods
  function handleComprasClick(){
    showFormBusqueda.value = false;
    showFormIngresar.value = true;
    modalStore.eliminarModal('showModalB');
  }
  function handleRecomprasClick(){
    showFormIngresar.value = false;
    showFormBusqueda.value = true;
    modalStore.eliminarModal('showModalA');
  }

  function aperturarModalB(){
    modalStore.crearModal('showModalB')
  }
  function usar(dato){
    dbStore.r_.cod_search = dato;
  }
</script>

<template>
  <div class="contenedor-formularios">
    <div class="botones">
      <button class="btnUno" @click="handleComprasClick()">Comprar</button>
      <button class="btnUno" @click="handleRecomprasClick()">Recomprar</button>
    </div>
    <div v-if="showFormIngresar" class="contenedor-formularios">
      <div class="contenedor-formularios-into">
        <form-ingresar 
          titulo="Comprar nuevo producto" 
        />
        <form-categorias />
      </div>
      <div v-if="modalStore.showModalA">
        <tab-mo-compra 
          titulo="Pre lista de compras" 
        />
      </div>
      <tab-pr-compra 
        titulo="Lista de recompras" 
        :db="dbStore.c_.array_compras"
      />
      <div v-if="modalStore.showModalPrintPr" :class="{ modal: true, 'modal-show': modalStore.showModalPrintPr }">
        <tab-print-pr
          titulo="Imprimir lista de recompras"
          :db="dbStore.c_.array_compras"
        />
      </div>
    </div>
    <div v-if="showFormBusqueda" class="contenedor-formularios">
      <div class="contenedor-formularios-into">
        <form-busqueda 
          titulo="Recomprar producto existente" 
          :clickFuncion="aperturarModalB"
          />
        <form-bus-detal>
          <template #actions="{ dato }">
              <button style="cursor:pointer;" @click="usar(dato)">Usar</button>
          </template>
        </form-bus-detal>
      </div>
      <div v-if="modalStore.showModalB">
        <tab-mod-recompra 
          titulo="Pre lista de recompras" 
        />
      </div>
      <tab-pr-compra 
        titulo="Lista de recompras"
        :db="dbStore.r_.array_recompras"
      />
      <div v-if="modalStore.showModalPrintPr" :class="{ modal: true, 'modal-show': modalStore.showModalPrintPr }">
        <tab-print-pr
          titulo="Imprimir lista de recompras"
          :db="dbStore.r_.array_recompras"
        />
      </div>
    </div>
    <div :class="{ modal: true, 'modal-show': modalStore.showModalMsj.state }">
        <dial-mo-mensajes />
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
  background: var(--fondo-primero);
}
</style>