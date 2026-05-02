<script setup>
import { ref } from 'vue';
import { useModalStore } from '../stores/modalStore';
import TablaUno from '../components/tables/TablaUno.vue';
import SelectDev from '../components/selects/SelectDev.vue';
import InputText from '../components/inputs/InputText.vue';
import InputNumber from '../components/inputs/InputNumber.vue';
import InputCant from '../components/inputs/InputCant.vue';

const modalStore = useModalStore();
const selectedProducts = ref([]);
const contInput = ref('');

const columns = [
  { label: 'Nombre', value: 'nombre', style: { width: '200px', fontSize: '14px', textAlign: 'left' }, filter: true },
  { label: 'Precio', value: 'precio', style: { width: '50px', fontSize: '14px', textAlign: 'right' }, filter: true },
  { label: 'Stock', value: 'stock', style: { width: '50px', fontSize: '14px', textAlign: 'right' }, filter: true },
  { label: 'Uno', button: true, method: mensajeAlerta, style: { width: '50px', fontSize: '14px', textAlign: 'center' } },
  { label: 'Dos', button: true, method: mensajeAlertaDos, style: { width: '50px', fontSize: '14px', textAlign: 'center' } }
];

const rows = [
  { id: 1, nombre: 'Producto 1', precio: '$10.00', stock: 100 },
  { id: 2, nombre: 'Producto 2', precio: '$20.00', stock: 50 },
  { id: 3, nombre: 'Producto 3', precio: '$15.00', stock: 75 }
];

function mensaje () {
  console.log('hola calichin estas en el home');
}

function mostrarAlerta () {
    modalStore.createAlert('success', '¡Éxito!', 'La operación se completó correctamente.', 'Aceptar', '400px');
}
function mostrarActionModal () {
    modalStore.createActionModal(mensaje, '¿Estás seguro de que deseas realizar esta acción?');
}
function mensajeAlerta () {
    alert('Acción confirmada');
}
function mensajeAlertaDos () {
    alert('Acción confirmada');
}

function handleSelectionChange(rows) {
  console.log('filas seleccionadas:', rows);
}

function eliminarSeleccionados() {
  const nombres = selectedProducts.value.map((product) => product.nombre).join(', ');
  alert(`Eliminar: ${nombres}`);
}

function exportarSeleccionados() {
  console.log('exportando filas:', selectedProducts.value);
}
</script>

<template>
  <div style="display: grid; gap: 20px;">
    <h1 class="title">hola calichin estas en el home</h1>
    <button @click="mostrarAlerta">Mostrar Alerta</button>
    <button @click="mostrarActionModal">Mostrar Action Modal</button>
    <TablaUno
      title="Tabla de Productos"
      :columns="columns"
      :rows="rows"
      v-model:selectedRows="selectedProducts"
      @selection-change="handleSelectionChange"
      :select="true"
    />
    <div>Seleccionados: {{ selectedProducts.length }}</div>
    <div style="display: flex; gap: 12px;">
      <button :disabled="selectedProducts.length === 0" @click="eliminarSeleccionados">
        Eliminar seleccionados
      </button>
      <button :disabled="selectedProducts.length === 0" @click="exportarSeleccionados">
        Exportar seleccionados
      </button>
    </div>
    <div style="width: 400px;">
      <select-dev :group="[
        {value: 1, label: 'Producto defectuoso'},
        {value: 2, label: 'Producto dañado durante el envío'},
        {value: 3, label: 'Producto incorrecto o equivocado'},
        {value: 4, label: 'Talla o ajuste incorrecto'},
        {value: 5, label: 'Insatisfacción con el producto'},
        {value: 6, label: 'Cambio por otro producto'},
        {value: 7, label: 'Cancelación del pedido'},
        {value: 8, label: 'Entrega retrasada'},

      ]" label="Causa de devolución" />
    </div>
    <div style="width: 400px;">
      <input-text label="Nombre del producto" v-model="contInput" />
    </div>
    <div style="width: 400px;">
      <input-number label="Cantidad" v-model="contInput" />
    </div>  
    <div style="width: 200px;">
      <input-cant label="Cantidad" v-model="contInput" />
    </div>  
  </div>
</template>

<style scoped>
.title{
    color: rgb(88, 199, 88);
}
</style>