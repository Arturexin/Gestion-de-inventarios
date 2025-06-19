<script setup>
    import { ref } from 'vue';
    import TabInvUno from '../../components/tables/TabInvUno.vue';
    import TicketModal from '../../components/modal/TicketModal.vue';
    import DialMoMensajes from '../../components/modal/DialMoMensajes.vue';
    import TabMoCredito from '../../components/modal/TabMoCredito.vue';
    import TabMoReportes from '../../components/modal/TabMoReportes.vue';
    import { useModalStore } from '../../stores/modalStore';    
    import { useDataBases } from '../../stores/dataBases';
    import { cargarDatos, enviarDatos, generarFecha } from '../../services/functionFetch';


    //states
    const columns = ref([//definimos la estructura de thead
        { key: 'sucursal_nombre', label: 'Sucursal', width: '130px', filterable: true, element: 'filtro_uno', fondo: '', alineacion: 'left' },
        { key: 'comprobante', label: 'Operación', width: '100px', filterable: true, element: 'filtro_dos', fondo: '', alineacion: 'left' },
        { key: 'tipo_comprobante', label: 'Comprobante', width: '100px', filterable: true, element: 'filtro_tres', fondo: '', alineacion: 'left' },
        { key: 'nombre_cli', label: 'Cliente', width: '100px', filterable: true, element: 'filtro_cuatro', fondo: '', alineacion: 'left' },
        { key: 'modo_efectivo', label: 'Efectivo', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'modo_tarjeta', label: 'Tarjeta', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'modo_credito', label: 'Crédito', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'modo_perdida', label: 'Dev', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'canal_venta', label: 'Canal de venta', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'left' },
        { key: 'situacion', label: 'Situación', width: '90px', filterable: false, element: '', fondo: '', alineacion: 'left' },
        { key: 'fecha_det_ventas', label: 'Fecha', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'center' },
    ]);

    const mensaje_ = ref('')

    const data_negocio = ref([])
    const data_venta = ref({})
    const items_venta = ref([])

    const data_credito = ref([])
    const data_reporte = ref([])

    const modalStore = useModalStore();
    const dbStore = useDataBases();
    //methods
    function buildUrl(index, filters, inicio, fin, filtroSelect, num = null) {// definimos los datos de la ruta
        let fecha_inicio = ['2000-01-01', inicio];
        let fecha_fin = [new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), fin];
        let datos_ =    `sucursal_det_venta=${filters.filtro_uno}&`+
                        `comprobante_det_venta=${filters.filtro_dos}&`+
                        `tipComp_det_venta=${filters.filtro_tres}&`+
                        `cliente_det_venta=${filters.filtro_cuatro}&`+
                        `fecha_inicio_det_venta=${fecha_inicio[index]}&`+
                        `fecha_fin_det_venta=${fecha_fin[index]}`;

        let url = `ventas_conteo?` + datos_;
                    
        if (num !== null) {
            url = `ventas_tabla/${num}?` + datos_;
        }
        return url;
    };

    async function buscarTicketVenta(dato){
        data_negocio.value = dbStore.db_negocio
        data_venta.value = dato
        items_venta.value = await cargarDatos(`salidas_comprobante/${dato.comprobante}`)

        modalStore.crearModal('showModalTickets')
    };
    async function buscarCredito(dato){
        if(Number(dato.modo_credito) > 0){
            const credito_ = await cargarDatos(`credito_comprobante/${dato.id_det_ventas}`)
            data_venta.value = dato
            data_credito.value = credito_
            modalStore.crearModal('showModalCreditos')
        }else{
            mensaje_.value = `La operación ${dato.comprobante} no presenta saldo adeudado.`
            modalStore.createMsj('showModalMsj', `${mensaje_.value}`, 2);
        }
    };
    async function procesarPagoCredito(){
        if (dbStore.array_creditos[0].saldo_total >= 0 && 
        (dbStore.array_creditos[0].efectivo > 0 || 
        dbStore.array_creditos[0].tarjeta > 0)){

            dbStore.array_creditos[0].fecha_cre = generarFecha();
            dbStore.array_creditos[0].situacion =   dbStore.array_creditos[0].saldo_perdida > 0 ? "pérdida" : 
                                                    dbStore.array_creditos[0].saldo_total > 0 ? "pendiente" : "liquidado";
            
            let ruta = 'operar_creditos'
            let responde_credito = await enviarDatos(ruta, dbStore.array_creditos[0])
            if(responde_credito.status === "success"){
                mensaje_.value = `${responde_credito.message}`
                modalStore.eliminarModal('showModalCreditos')
            };
        }else if (dbStore.array_creditos[0].saldo_total < 0){
            mensaje_.value = `El pago excede al saldo adeudado.`
        }else if (dbStore.array_creditos[0].efectivo <= 0 && dbStore.array_creditos[0].tarjeta <= 0){
            mensaje_.value = `Ingrese una cantidad y método de pago válido.`
        }
        modalStore.createMsj('showModalMsj', `${mensaje_.value}`, 2);
    };
    async function revertirUltimoPago(){
        if (data_credito.value.length > 1) {
            let ruta = 'creditos_remove'
            let data = {
                'id_creditos': data_credito.value[data_credito.value.length - 1].id_creditos
            };
            let response = await enviarDatos(ruta, data);
            if(response.status === "success"){
                mensaje_.value = `${response.message}`
                modalStore.eliminarModal('showModalCreditos')
                modalStore.createMsj('showModalMsj', `${mensaje_.value}`, 2);
            };
        };
    };

    async function reporte_creditos(){
        data_reporte.value = await cargarDatos(`credito_reporte_dos`)
        modalStore.crearModal('showModalReportes')
    }
</script>

<template>
  <div>
    <div class="contenedor_compras_principal">
        <div>
            <div class="titulo_graficos">
                <h4 style="font-size: 20px;">Metodo de Pago</h4>
                <div>N° de operaciones promedio 
                    <h4 style="font-size: 12px;">Local / Delivery</h4>
                    <span style="display: flex; gap: 5px;justify-content: center;">
                        <div>
                            <span id="promedio_venta_local" style="font-weight: bold;"></span>
                            <span style="font-weight: bold;"> / </span>
                            <span id="promedio_venta_delivery" style="font-weight: bold;"></span>
                        </div>
                    </span>
                </div>
            </div>  
            <div class="grafico_compras">
                <section id="contenedor_detalle_ventas">
                </section>
            </div>
        </div>
        <div>
            <div>
                <h4 style="font-size: 20px;">Operaciones acumuladas por sucursal</h4>
            </div>
            <div id="contenedor_detalle_sucursales">
            </div>
            <div style="display: flex; gap: 11px; align-content: center;">
                
                <div class="contenedor_dona" style="width: 100px; height: 45px;font-size: 10px;"><span>Almacén Central</span><canvas class="absoluto_local"></canvas></div>
                <div class="contenedor_dona" style="width: 100px; height: 45px;font-size: 10px;"><span>Sucursal Uno</span><canvas class="absoluto_local"></canvas></div>
                <div class="contenedor_dona" style="width: 100px; height: 45px;font-size: 10px;"><span>Sucursal Dos</span><canvas class="absoluto_local"></canvas></div>
                <div class="contenedor_dona" style="width: 100px; height: 45px;font-size: 10px;"><span>Sucursal Tres</span><canvas class="absoluto_local"></canvas></div>
                <div class="contenedor_dona" style="width: 100px; height: 45px;font-size: 10px;"><span>Sucursal Cuatro</span><canvas class="absoluto_local"></canvas></div>
            </div>
        </div>
    </div>
    <!-- Nos aseguramos que se cargue antes db_negocio para evitar problemas de asincronía -->
    <div v-if="modalStore.showModalTickets && data_negocio.length && Object.keys(data_venta).length" 
        :class="{ modal: true, 'modal-show': modalStore.showModalTickets }">
        <ticket-modal
            :data_negocio="data_negocio"
            :items_venta="items_venta"
            :data_venta="data_venta"
        />
    </div>
    <div v-if="data_credito.length && Object.keys(data_venta).length" :class="{ modal: true, 'modal-show': modalStore.showModalCreditos}">
        <tab-mo-credito 
        :data_credito="data_credito"
        :data_venta="data_venta"
        :clickFunctionProcesar="procesarPagoCredito"
        :clickFunctionRevertir="revertirUltimoPago"
        />
    </div>
    <div :class="{ modal: true, 'modal-show': modalStore.showModalReportes }">
        <tab-mo-reportes 
        titulo_reporte="Cuentas por cobrar"
        :data_reporte="data_reporte"
        />
    </div>
    <div :class="{ modal: true, 'modal-show': modalStore.showModalMsj.state }">
        <dial-mo-mensajes />
    </div>

    <div>
        <tab-inv-uno 
            row_title="Detalle de ventas" 
            :row_select="false" 
            :row_button="true" 
            :row_date="true" 
            :columns="columns" 
            :buildUrl="buildUrl" 
            idKey="id_det_ventas"
            :clickFunctionReportes="reporte_creditos"
        >
            <template #actions="{ dato }">
                <div class="tooltip">
                    <button class="btnUnoB" @click="buscarTicketVenta(dato)">
                        <span style="font-size:18px;" class="myButtonEditar material-symbols-outlined">print</span>
                        <span class="tooltiptext">Imprimir comprobante</span>
                    </button>
                    
                </div>
                <div class="tooltip">
                    <button class="btnUnoB" @click="buscarCredito(dato)">
                        <span style="font-size:18px;" class="myButtonEditar material-symbols-outlined">credit_card</span>
                        <span class="tooltiptext">Saldo de crédito</span>
                    </button>
                </div>
            </template>
        </tab-inv-uno >
    </div>

    <details>
        <summary>Acciones</summary>
        <div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined myButtonEditar">print</div>
                <span>Esta acción genera una copia del comprobante de pago.</span></div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined myButtonEditar">credit_card</div>
                <span>Esta acción permite gestionar las ventas que fueron relizadas a crédito (Solo aplica si presenta un saldo en crédito).</span></div>
        </div>
    </details>
  </div>
</template>

<style scoped>
.title{
  color: rgb(25, 0, 255);
}

</style>