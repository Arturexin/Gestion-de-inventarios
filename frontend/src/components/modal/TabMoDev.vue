<script setup>

    import { defineProps, ref, watch, nextTick } from 'vue';
    import { useModalStore } from '../../stores/modalStore';
    import { useDataBases } from '../../stores/dataBases';

    //props
    const props = defineProps({
        titulo: {
            type: String,
            required: true
        },
        data: {
            type: Object,
            required: true
        },
        name_button: {
            type: String,
            required: true
        },
        clickFuncion: {
            type: Function,
            required: false
        },
        db_data_sucursales: {
            type: Array,
            required: true
        },
    });

    const modalStore = useModalStore();
    const dbStore = useDataBases();

    //methods
    function cerrarModalMensajesTablas(){
        modalStore.eliminarModal('showModalAcciones')
        modalStore.numerarEstadoModal('llenarShowModalAcciones', 0)
    }
    class ObjetoData {
        constructor(id_prod, id_sucursal, id_operacion, nombre_sucursal, existencias, existencias_dev, input_number, causa, comprobante, precio, cliente) {
            this.id_prod = id_prod;
            this.id_sucursal = id_sucursal;
            this.id_operacion = id_operacion;
            this.nombre_sucursal = nombre_sucursal;
            this.existencias = existencias;
            this.existencias_dev = existencias_dev;
            this.input_number = input_number;
            this.causa = causa;
            this.comprobante = comprobante;
            this.precio = precio;
            this.cliente = cliente;
        };
    };

    function procesarData(num_iteraciones) {
        dbStore.array_dev = []; // Limpiar datos procesados antes de agregar nuevos
        for(let i = 0; i < num_iteraciones; i++){
            dbStore.array_dev.push(new ObjetoData(
                props.data.idProd,
                props.data.id_sucursales,
                props.data.id_operacion,
                props.data.sucursal_nombre,
                props.data.existencias_operacion,
                props.data.existencias_devueltas,
                0,
                0,
                props.data.comprobante,
                props.data.precio_venta_salidas,
                props.data.cliente
            ));
        };
    };

    function op_cantidad(e){// Opera las cantidades a transferir o recomprar con respecto a las existencias
        let row_ = e.target.closest("tr");

        row_.children[4].textContent =  Number(row_.children[1].textContent) - 
                                        (Number(row_.children[2].textContent) + Number(row_.children[3].children[0].value));

        Number(row_.children[3].children[0].value < 0) ?    row_.children[3].children[0].style.background = "var(--boton-dos)": 
                                                            row_.children[3].children[0].style.background = "";
        Number(row_.children[4].textContent) < 0 || 
        isNaN(Number(row_.children[4].textContent)) ?   row_.children[4].style.background = "var(--boton-dos)": 
                                                        row_.children[4].style.background = "";

    };
    
    watch(() => modalStore.llenarShowModalAcciones, async (newVal) => {
        if (newVal === 3) {
            /* await nextTick(); */
            procesarData(1);
        }
    });
</script>

<template>
    <div>
        <table class="tabla_modal contenido-tabla" style="width: 600px;">
            <thead>
                <tr>
                    <th scope="row" colspan="15">
                        <h2>{{ props.titulo }}</h2>
                    </th>
                </tr>
                <tr>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 200px;">Descripción</th>
                    <th style="width: 200px;">Operación</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <!-- <td id="id_prod" class="inv">{{ props.data.idProd }}</td> -->
                    <td style="width: 120px; text-align: center;">{{ props.data.categoria_nombre }}</td>
                    <td style="width: 120px; text-align: center;">{{ props.data.codigo }}</td>
                    <td style="width: 200px; text-align: center;">{{ props.data.descripcion }}</td>
                    <td style="width: 200px; text-align: center;">{{ props.data.comprobante }}</td>
                </tr>
            </tbody>
        </table>
        <br>
        <table class="tabla-proforma" id="tabla_proforma_producto" style="width: 800px;">
            <thead>
                <tr>
                    <th>Sucursal</th>
                    <th>Existencias</th>
                    <th>Devoluciones</th>
                    <th>Devolver</th>
                    <th>Saldo</th>
                    <th>Causa</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(devolucion, index) in dbStore.array_dev" :key="index">
                    <td 
                        class="nom_suc" 
                        :style="{ textAlign: 'center', width: '180px', borderLeft: '7px solid ' + dbStore.CS(devolucion.nombre_sucursal) }"
                    >
                        {{ devolucion.nombre_sucursal }}
                    </td>
                    <td style="text-align: center; width: 90px">{{ devolucion.existencias }}</td>
                    <td style="text-align: center; width: 90px">{{ devolucion.existencias_dev }}</td>
                    <td style="text-align: center; width: 180px;">
                        <input class="input-tablas-dos-largo q_" v-model.number="devolucion.input_number" @input="op_cantidad($event)">
                    </td>
                    <td style="text-align: center; width: 90px" class="s_">{{ devolucion.existencias - devolucion.existencias_dev }}</td>
                    <td>
                        <select v-model="devolucion.causa" id="select_causas" class="input-select-ventas" style="font-size: 14px;">
                            <option value="0" selected="">-- Causa de devolución --</option>                                    
                            <option value= "1">Producto defectuoso</option>
                            <option value= "2">Producto dañado durante el envío</option>
                            <option value= "3">Producto incorrecto o equivocado</option>
                            <option value= "4">Talla o ajuste incorrecto</option>
                            <option value= "5">Insatisfacción con el producto</option>
                            <option value= "6">Cambio por otro producto</option>
                            <option value= "7">Cancelación del pedido</option>
                            <option value= "8">Entrega retrasada</option>
                        </select>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    
                    <th scope="row" colspan="15">
                        <div style="display: grid;gap: 10px; grid-template-columns: 30% 30%;justify-content: center;">
                            
                            <button class="btnUnoB" @click="props.clickFuncion">{{ props.name_button }}</button>
                            <button class="btnDosB" @click="cerrarModalMensajesTablas()">Cancelar</button>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style scoped>
.botones_respuesta{
    display: flex;
    gap: 10px;
    justify-content: center;
}
.input-tablas-dos-largo{
    text-align: center;
    height: 18px;
    width: 90px;
    margin: 0px 5px;
    border: none;
    padding: 2px;
}
</style>