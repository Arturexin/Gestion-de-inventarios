<script setup>
    import { defineProps, computed } from 'vue';
    import { useDataBases } from '../../stores/dataBases';
    import { useModalStore } from '../../stores/modalStore';
    //props
    const props = defineProps({
        data_negocio: {
            type: Array,
            required: true
        },
        items_venta: {
            type: Array,
            required: true
        },
        data_venta: {
            type: Object,
            required: true
        },
    });

    const dbStore = useDataBases();
    const modalStore = useModalStore();
    const tipo_comprobante = [
        {tipo: 'Nota de Venta', letra: 'N'},
        {tipo: 'Boleta de Venta', letra: 'B'},
        {tipo: 'Factura', letra: 'F'},
        {tipo: 'Proforma', letra: 'P'},
    ]
    function cerrarTicket(){
        modalStore.eliminarModal('showModalTickets')
    }
    const totalImporte = computed(() => {
        return props.items_venta.reduce((total, item) => {
            return total + (item.precio * item.existencias);
        }, 0);
    });
</script>

<template>
    <div>
        <div class="ticket">
            <h3 class="ticket_head" style="text-align: center;">
                <span>
                    {{ tipo_comprobante.find(x => x.letra === props.data_venta.tipo_comprobante.charAt(0)).tipo }}
                </span>
                <span>
                    {{ props.data_venta.tipo_comprobante }}
                </span>
            </h3>
            <div class="ticket_head">
                <span>Sede: {{ props.data_venta.sucursal_nombre }}</span>
                <span>{{ props.data_negocio[0].nombre_empresa }}</span>
                <span>RUC: {{ props.data_negocio[0].ruc }}</span>
                <span>FECHA   : {{ props.data_venta.fecha_det_ventas }}</span>
            </div>

            <span>CLIENTE : {{ props.data_venta.nombre_cli === "Sin datos" ? "": props.data_venta.nombre_cli }}</span>
            <table>
                <thead class="tabla_head">
                    <tr>
                        <th>PRODUCTO</th>
                        <th>UNID</th>
                        <th>PRECIO</th>
                        <th>IMPORTE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in props.items_venta"> 
                        <td style="text-align: left; width: 300px;">{{ item.descripcion }}</td>
                        <td style="text-align: right; width: 40px;">{{ item.existencias }}</td>
                        <td style="text-align: right; width: 60px;">{{ (item.precio).toFixed(2) }}</td>
                        <td style="text-align: right; width: 60px;">{{ (item.precio * item.existencias).toFixed(2) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr v-if="props.data_venta.tipo_comprobante.charAt(0) !== 'N' && props.data_venta.tipo_comprobante.charAt(0) !== 'P'">
                        <th>OP. GRAVADAS</th>
                        <th></th>
                        <th></th>
                        <th style="text-align: right; width: 100px;"> {{ ((1/1.18) * totalImporte).toFixed(2) }} </th>
                    </tr>
                    <tr v-if="props.data_venta.tipo_comprobante.charAt(0) !== 'N' && props.data_venta.tipo_comprobante.charAt(0) !== 'P'">
                        <th>I.G.V.</th>
                        <th>18%</th>
                        <th></th>
                        <th style="text-align: right; width: 100px;"> {{ ((totalImporte)-((1/1.18)*totalImporte)).toFixed(2) }} </th>
                    </tr>
                    <tr>
                        <th>IMPORTE TOTAL</th>
                        <th></th>
                        <th></th>
                        <th style="text-align: right; width: 100px;"> {{totalImporte.toFixed(2)}}</th>
                    </tr>
                </tfoot>   
            </table>
            <div class="ticket_foot">
                <div style="display: flex; gap: 10px;">
                    <span style="font-size: 9px">USUARIO: {{ dbStore.db_usuario.nombres }}</span>
                    <span style="font-size: 9px">LADO: COPIA</span>
                </div>
                <!-- <img style="height: 40px" class="codBarTicket" src=""> -->
                
                <span>Gracias por su preferencia.</span> 
                <span>Whatsapp: {{ props.data_negocio[0].web }}</span>   
                <span> dirección: {{ props.data_negocio[0].direccion }}</span>
            </div>
        </div>
        <button @click="cerrarTicket" class="btnDosB">
            X
        </button>
        
    </div>
</template>

<style scoped>
.ticket{
    background: #eee;
    color: black;
    width: 260px;
    padding: 5px;
    font-size: 10px;
}
.ticket_head{
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: space-evenly;
}
.ticket_foot{

    display: grid;
    gap: 5px;
    justify-items: center;
}
</style>