<script setup>
    import { useDataBases } from '../../stores/dataBases';
    import { ref, watch, onMounted } from 'vue';
    import FormCredito from '../forms/FormCredito.vue';


    const props = defineProps({
        function_click: {
            type: Function,
            required: true
        }
    });
    const dbStore = useDataBases();

    

    const total_cantidad = ref(0);
    const total_importe = ref(0);
    function calcularTotales(){
        total_cantidad.value = 0;
        total_importe.value = 0;
        dbStore.v_.array_venta[1].forEach((e) => {
            total_cantidad.value += e[dbStore.v_.array_venta[0].suc[1]];
            total_importe.value += e[dbStore.v_.array_venta[0].suc[1]] * e.precio;
        });
    };
    function eliminarProducto(idProd){
        dbStore.v_.array_venta[1] = dbStore.v_.array_venta[1].filter((e) => e.idProd != idProd);
    };
    function eliminarProductos(){
        dbStore.v_.array_venta = [{ id_sucursal: 0, suc: [], comprobante: '' }, []];
    };
    function eventoCheck(){
        dbStore.v_.check_ticket_venta = !dbStore.v_.check_ticket_venta;
    }
    watch(() => dbStore.v_.array_venta, calcularTotales, { deep: true });
    onMounted(() => {
        dbStore.v_.check_ticket_venta = false;
    });
</script>

<template>
    <div class="contenedor-ventas-tabla">
        <table id="tabla-ventas" class="tabla-proforma" style="width: 790px;">
            <thead>
                <tr>
                    <th scope="row" colspan="7">
                        <h2 class="uno_form">Lista de Productos</h2>
                        <div class="tooltip_ayuda">
                            <button class="btnUnoB" id="actualizar_saldos">Actualizar saldos</button>
                            <span class="tooltiptext_ayuda">Actualiza los saldos y existencias de los productos de la lista.</span>
                        </div>
                    </th>
                </tr>
                <tr>
                    <th style="width: 100px;">Código</th>
                    <th style="width: 200px;">Descripción</th>
                    <th>Medidas</th>
                    <th>Cantidad</th>
                    <th style="width: 100px;">Precio</th>
                    <th style="width: 100px;">Importe</th>
                    <th style="text-align: center; display: flex; gap: 5px; align-items: center; justify-content: center;">
                        <div class="tooltip btnDosB">
                            <button class="btnDosB" @click="eliminarProductos">
                                <span class="material-symbols-outlined">delete</span>
                                <span class="tooltiptext">Descartar</span>
                            </button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="e in dbStore.v_.array_venta[1]" :key="e.idProd">
                    <td>{{ e.codigo }}</td>
                    <td>{{ e.descripcion }}</td>
                    <td>{{ e.talla }}</td>
                    <td style="text-align: center;">{{ e[dbStore.v_.array_venta[0].suc[1]] }}</td>
                    <td style="text-align: right;">{{ e.precio.toFixed(2) }}</td>
                    <td style="text-align: right;">{{ (e[dbStore.v_.array_venta[0].suc[1]] * e.precio).toFixed(2) }}</td>
                    <td style="text-align: center; display: flex; gap: 5px; align-items: center; justify-content: center;">
                        <div class="tooltip">
                            <button class="btnDosB" @click="eliminarProducto(e.idProd)">
                                <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
                                <span class="tooltiptext">Descartar</span>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                <th scope="row" colspan="3">Total</th>
                <th style="text-align: center;">{{ total_cantidad }}</th>
                <th class="moneda_ventas"></th>
                <th style="text-align: right;">{{ total_importe.toFixed(2) }}</th>
                <th></th>
                </tr>
            </tfoot>
        </table>
        <div class="contenedor-ventas-metodo">
            <div>
                <form-credito 
                    :total_importe="total_importe" 
                />
            </div>
            <div class="procesar-venta">
                <label class="label-checkbox">Imprimir comprobante 
                    <input type="checkbox" @click="eventoCheck()">
                </label>
                <button class="btnTres" @click="props.function_click">Procesar Venta</button>
                <button id="reporte_ventas_hoy" class="btnUno">Reporte de Ventas</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.contenedor-ventas-tabla{
    display: grid;
    gap: 10px;
    background: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto));
}
.contenedor-ventas-metodo{
    display: flex;
    gap: 20px;
    justify-content: space-around;
    padding: 20px;
}
.procesar-venta{
    display: grid;
    gap: 10px;
    align-items: center;
    background: var(--fondo-primero);
    padding: 10px;
}

.label-checkbox{
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid var(--border-principal);
}

</style>