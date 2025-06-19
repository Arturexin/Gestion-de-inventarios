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
  function cerrarModalC(){
    modalStore.eliminarModal('showModalC')
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
                    <th style="width: 120px;">Sucursal de origen
                        <select id="sun_opc" class="select_input"></select>
                    </th>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 120px;">Descripción</th>
                    <th style="width: 70px;">Existencias de origen</th>
                    <th style="width: 70px;">Saldo en origen</th>
                    <th style="width: 70px;">Unidades a transferir</th>
                    <th style="width: 70px;">Sucursal de destino
                        <select id="sun_opc_dos" class="select_input"></select>
                    </th>
                    <th style="width: 70px;">Existencias en destino</th>
                    <th style="width: 70px;">Saldo en destino</th>
                    <th style="width: 40px;">
                        <div class="btnDosB" @click="cerrarModalC">
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
                        <button class="btnDos" @click="cerrarModalC">Cancelar</button>
                    </div>
                </th>
            </tr>
        </tfoot>
    </table>
  </div>
</template>

<style scoped>
</style>