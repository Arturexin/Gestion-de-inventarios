<script setup>
    import { ref, defineProps } from 'vue';
    import { useModalStore } from '../../stores/modalStore';
    import { useDataBases } from '../../stores/dataBases';    



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
    const existencia_ = ref('0');
    const operacion = ref('0');
    const color_suc = ref('');
    const mensaje_ = ref(''); // Estado para rastrear el mensaje de la modal


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
        existencia_.value = dbStore._sucursales_nombre.find(x=> x.name === name_suc.value).stock;
        color_suc.value = dbStore.CS(name_suc.value);
    }

    function cerrarModalB(){
        dbStore.r_.array_init = [];
        modalStore.eliminarModal('showModalB')
    }
    function eliminarFila(codigo){
        const index = dbStore.r_.array_init.findIndex(item => item.codigo === codigo);
        if (index !== -1) {
            dbStore.r_.array_init.splice(index, 1);
        } else {
            console.error(`No se encontró el elemento con código: ${codigo}`);
        };
    };

    function procesar(){
        let no_procesa = [];
        for (let i = dbStore.r_.array_init.length - 1; i >= 0; i--) {
            const item = dbStore.r_.array_init[i];
            const q_ = dbStore.val_exs_('r_', i);
            const p_ = dbStore.val_positivo('r_', i);

            if (q_.every(valor => valor >= 0 && Number.isFinite(valor)) &&
            q_.some(valor => valor > 0) && p_.every(valor => valor >= 0)){
                dbStore.r_.array_recompras.unshift(item);
                dbStore.r_.array_init.splice(i, 1); // Elimina el elemento del índice actual
            } else {
                no_procesa.push(item.codigo);
            }
        };

        if (no_procesa.length > 0) {
            mensaje_.value = `No se puede procesar el producto "${no_procesa.join(', ')}" porque contiene valores no válidos.`;
            modalStore.createMsj('showModalMsj', mensaje_.value, 2);
        };

        if(dbStore.r_.array_init.length <= 0){
            modalStore.eliminarModal('showModalB');
        };
        console.log(dbStore.r_.array_init)
    };
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
                    <th style="width: 120px;">Descripción</th>
                    <th style="width: 70px;">Existencias</th>
                    <th style="width: 70px;">Cantidad a comprar</th>
                    <th style="width: 70px;">Saldo existencias</th>
                    <th style="width: 70px;">CU</th>
                    <th style="width: 70px;">CT</th>
                    <th style="width: 40px;">
                        <div class="btnDosB" @click="cerrarModalB">
                            <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                        </div>
                    </th>
                </tr>
        </thead>
        <tbody>
            <tr v-for="(e, i) in dbStore.r_.array_init" :key="i" 
                :style="{background: dbStore.r_.cod_ref?.codigo === e.codigo ? 'var(--suc-uno)' : ''}"
            >
                <td :style="{ borderLeft: '6px solid ' + color_suc } ">{{ name_suc }}</td>
                <td>{{ e.name_cat }}</td>
                <td>{{ e.codigo }}</td>
                <td>{{ e.descripcion }}</td>
                <td style="text-align: right;">{{ e[existencia_] || 0 }}</td>
                <td>
                    <input type="text" class="input_num" v-model.number="e[operacion]">
                </td>
                <td 
                    style="text-align: right;"
                    :style="{background: (Number(e[existencia_]) + Number(e[operacion])) < 0 ? 'var(--boton-dos)' : ''}"
                >
                    {{ Number(e[existencia_]) + Number(e[operacion]) }}
                </td>
                <td style="text-align: right;">{{ e.costo.toFixed(2) }}</td>
                <td style="text-align: right;">{{ (Number(e.costo) * Number(e[operacion])).toFixed(2) }}</td>
                <td style="text-align: center;">
                    <div class="tooltip">
                        <button class="btnDosB" @click="eliminarFila(e.codigo)">
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
                        <button class="btnDos" @click="cerrarModalB">Cancelar</button>
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
</style>