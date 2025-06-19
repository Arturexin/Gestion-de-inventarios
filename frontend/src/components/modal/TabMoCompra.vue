<script setup>
  import { ref, onMounted } from 'vue';
  import { useModalStore } from '../../stores/modalStore';
  import { useDataBases } from '../../stores/dataBases';
  import { defineProps } from 'vue';
  import { expReg } from '../../services/expReg.js';

  const modalStore = useModalStore();
  const dbStore = useDataBases();
  const props = defineProps({
    titulo: {
        type: String,
        required: true
    }
  });

  const id_suc = ref('0');
  const name_suc = ref('');
  const name_cat = ref('');
  const name_prov = ref('');
  const operacion = ref('0');
  const color_suc = ref('');
  const mensaje_ = ref(''); // Estado para rastrear el mensaje de la modal


  function cerrarModalA(){
    modalStore.eliminarModal('showModalA')
    dbStore.c_.array_init = [];
  }

  function changeSucursal(){
    if(dbStore.db_sucursales.length === 0){
      console.log("No hay sucursales disponibles");
      return;
    }
    if (id_suc.value === '0') {
      name_suc.value = '';
      operacion.value = '0';
      color_suc.value = '';
      return;
    }
    name_suc.value = dbStore.db_sucursales.find(sucursal => sucursal.id_sucursales === id_suc.value).sucursal_nombre;
    operacion.value = dbStore._sucursales_nombre.find(x=> x.name === name_suc.value).operacion;
    color_suc.value = dbStore.CS(name_suc.value);
  }
  function formatearCosto(event) {
    if (!event || typeof event.costo === 'undefined') {
      console.error('El objeto o la propiedad "costo" no existen');
      return;
    }
    const valor = Number(event.costo);
    event.costo = isNaN(valor) ? '0.00' : valor.toFixed(2);
  }
  function eliminarFila(codigo){
    const index = dbStore.c_.array_init.findIndex(item => item.codigo === codigo);
    if (index !== -1) {
      dbStore.c_.array_init.splice(index, 1);
    } else {
      console.error(`No se encontró el elemento con código: ${codigo}`);
    };
  };
  function procesar(){
    let no_procesa = [];
    for (let i = dbStore.c_.array_init.length - 1; i >= 0; i--) {
        const item = dbStore.c_.array_init[i];
        item.name_cat = name_cat.value;
        item.name_prov = name_prov.value;
        const q_ = dbStore.val_exs_('c_', i);

        if (q_.every(valor => valor >= 0 && Number.isFinite(valor)) &&
            q_.some(valor => valor > 0) &&
            item.costo > 0 && item.precio > 0) {
            dbStore.c_.array_compras.unshift(item);
            dbStore.c_.array_init.splice(i, 1); // Elimina el elemento del índice actual
        } else {
            no_procesa.push(item.codigo);
        }
    };

    if (no_procesa.length > 0) {
        mensaje_.value = `No se puede procesar el producto "${no_procesa.join(', ')}" porque contiene valores no válidos.`;
        modalStore.createMsj('showModalMsj', mensaje_.value, 2);
    };
    if(dbStore.c_.array_init.length <= 0){
      modalStore.eliminarModal('showModalA');
    };
  };
  onMounted(() => {
    if (dbStore.c_.array_init.length > 0) {
      const firstItem = dbStore.c_.array_init[0];
      name_cat.value = dbStore.db_categorias.find(categoria => categoria.id === firstItem.categoria)?.categoria_nombre || '';
      name_prov.value = dbStore.db_proveedores.find(proveedor => proveedor.id_cli === firstItem.proveedor)?.nombre_cli || '';
    }
  });

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
                  <select v-model="id_suc" class="select_input" @change="changeSucursal">
                    <option value="0">-- Sucursal --</option>
                    <option v-for="e in dbStore.db_sucursales" :value="e.id_sucursales">{{ e.sucursal_nombre }}</option>
                  </select>
                </th>
                <th style="width: 120px;">Categoría</th>
                <th style="width: 120px;">Código</th>
                <th style="width: 200px;">Descripción</th>
                <th style="width: 70px;">Medidas</th>
                <th style="width: 70px;">Cantidad a Comprar</th>
                <th style="width: 70px;">Costo Unitario</th>
                <th style="width: 70px;">Costo Total</th>
                <th style="width: 70px;">Precio de Venta</th>
                <th style="width: 70px;">Proveedor</th>
                <th style="width: 40px;">
                    <div class="btnDosB" @click="cerrarModalA">
                        <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="event in dbStore.c_.array_init" :key="event.codigo">
                <td :style="{ borderLeft: '6px solid ' + color_suc } ">{{ name_suc }}</td>
                <td>{{ name_cat }}</td>
                <td>{{ event.codigo }}</td>
                <td>
                  <input type="text" class="input_text" v-model="event.descripcion">
                </td>
                <td>{{ event.talla }}</td>
                <td>
                  <input type="text" class="input_num" v-model.number="event[operacion]">
                </td>
                <td>
                  <input type="text" class="input_num" v-model.number="event.costo" @blur="formatearCosto(event)">
                </td>
                <td style="text-align: right;">{{ (Number(event.costo) * Number(event[operacion]) || 0).toFixed(2) }}</td>
                <td>
                  <input type="text" class="input_num" v-model="event.precio">
                </td>
                <td>{{ name_prov }}</td>
                <td style="text-align: center;">
                    <div class="tooltip">
                        <button class="btnDosB" @click="eliminarFila(event.codigo)">
                            <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                            <span class="tooltiptext">Eliminar producto</span>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th scope="row" colspan="18">
                    <div class="contenedor-btn">
                      <button class="btnUno" @click="procesar()">Mandar a la lista</button>
                      <button class="btnDos" @click="cerrarModalA">Cancelar</button>
                    </div>
                </th>
            </tr>
        </tfoot>
    </table>
  </div>
</template>

<style scoped>
.input_num{
  width: 60px;
  padding: 5px;
  border: 1px solid var(--border-principal);
  background: var(--fondo-quinto);
  text-align: right;
}
.input_text{
  width: 190px;
  padding: 5px;
  border: 1px solid var(--border-principal);
  background: var(--fondo-quinto);
  text-align: left;
}
</style>