<script setup>
  import { useModalStore } from '../../stores/modalStore';
  import { defineProps } from 'vue';
  import '../../styles/tabModal.css';

  const modalStore = useModalStore();
  const props = defineProps({
    titulo: {
        type: String,
        required: true
    }
  });


  function cerrarModalD(){
    modalStore.eliminarModal('showModalD')
  }
</script>

<template>
  <div class="contenedor-modal"> 
    <table id="tabla_modal" class="tabla_modal contenido-tabla">
        <thead>
            <tr>
                <th scope="row" colspan="18">
                    <h2>{{ props.titulo }}</h2>
                </th>
            </tr>
            <tr class="tbody_preproforma">
                <th style="width: 120px;">Sucursal
                    <select id="sun_opc" class="select_input"></select>
                </th>
                <th style="width: 120px;">Categoría</th>
                <th style="width: 120px;">Código</th>
                <th style="width: 120px;">Descripción</th>
                <th style="width: 70px;">Existencias</th>
                <th style="width: 70px;">Cantidad a comprar</th>
                <th style="width: 70px;">Saldo existencias</th>
                <th style="width: 70px;">CU</th>
                <th style="width: 70px;">CT de la compra</th>
                <th style="width: 70px;">Motivo</th>
                <th style="width: 40px;">
                    <div class="btnDosB" @click="cerrarModalD">
                        <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                    </div>
                
                </th>
            </tr>
        </thead>
        <tbody>
        </tbody>
        <tfoot>
            <tr>
                <th scope="row" colspan="18">
                    <div class="contenedor-btn">

                        <button class="btnUno">Mandar a la lista</button>
                        <button class="btnDos" @click="cerrarModalD">Cancelar</button>
                    </div>
                </th>
            </tr>
        </tfoot>
    </table>
  </div>
</template>

<style scoped>
</style>