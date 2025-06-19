<script setup>
    import { useDataBases } from '../../stores/dataBases';
    import { useModalStore } from '../../stores/modalStore.js';
    import { ref } from 'vue';
    import FormVentas from '../../components/forms/FormVentas.vue';
    import TabVenta from '../../components/tables/TabVenta.vue';
    import DialMoMensajes from '../../components/modal/DialMoMensajes.vue';
    import TicketModal from '../../components/modal/TicketModal.vue';
    import FormCli from '../../components/forms/FormCli.vue';
    import FormBusSimple from '../../components/forms/FormBusSimple.vue';
    import { generarFecha, enviarDatos } from '../../services/functionFetch.js';


    const dbStore = useDataBases();
    const modalStore = useModalStore();

    const mensaje_ = ref(''); // Estado para rastrear el mensaje de la modal

    const data_negocio = ref([])
    const data_venta = ref({})
    const items_venta = ref([])
    const clienteSeleccionado = ref(null);//creamos el estado que recibirá los datos de la tabla y pasaremos a FromCli.vue
    const cod_ = ref('');

    async function procesamientoVentas(){
        try{
            if(dbStore.v_.array_venta[1].length > 0 &&
            dbStore.v_.array_venta[0].comprobante !== "proforma"){
                await funcionGeneralVentas();
            }else if(dbStore.v_.array_venta[1].length === 0){
                mensaje_.value = `Imposible procesar, la lista está vacía.`;
            }else if(dbStore.v_.array_venta[0].comprobante === "proforma"){
                mensaje_.value = `Proforma creada.`;
                buscarTicketVenta('Proforma')
            };
            modalStore.createMsj('showModalMsj', mensaje_.value, 2);
        }catch(error){
            modalStore.createMsj('showModalMsj', "Ocurrió un error. " + error, "", 2);
        };
    };
    async function funcionGeneralVentas(){
        let array_productos = [];
        let array_salidas = [];
        function DatosProductos(a){
            this.idProd = a.idProd;
            this.existencias_ac = -a.q_ac;
            this.existencias_su = -a.q_su;
            this.existencias_sd = -a.q_sd;
            this.existencias_st = -a.q_st;
            this.existencias_sc = -a.q_sc;
        };
        function DatosSalidas(a, sucursal, suc){
            this.idProd = a.idProd;
            this.sucursal = sucursal;
            this.existencias_salidas = a[suc];
            this.precio_venta_salidas = a.precio;
        };
        dbStore.v_.array_venta[1].forEach((event)=>{
            array_productos.push(new DatosProductos(event))
            array_salidas.push(new DatosSalidas(event, dbStore.v_.array_venta[0].id_sucursal, dbStore.v_.array_venta[0].suc[1]))
        });

        function DatosDeVenta(){
            this.id_num = dbStore.db_negocio[0].id;
            
            this.sucursal_v = dbStore.v_.array_venta[0].id_sucursal;
            this.item_ticket = dbStore.v_.array_venta[0].comprobante;
            this.modo_efectivo = Number(dbStore.v_.objeto_modo_pago.modo_efectivo);
            this.modo_credito = Number(dbStore.v_.objeto_modo_pago.modo_credito);
            this.modo_tarjeta = Number(dbStore.v_.objeto_modo_pago.modo_tarjeta);
            this.modo_perdida = 0;
            this.canal_venta = dbStore.v_.objeto_modo_pago.canal_venta;
            this.dni_cliente = dbStore.v_.id_cliente_ventas !== 0 ? 
                                dbStore.v_.id_cliente_ventas : 
                                dbStore.db_clientes[0].id_cli;
            this.fecha = generarFecha();
            this.situacion = this.modo_credito > 0 ? "pendiente" : "liquidado";

            this.array_productos = array_productos;
            this.array_salidas = array_salidas;
        };
        let ruta = 'gestion_de_venta'
        let objeto_venta = new DatosDeVenta();
        
        let response = await enviarDatos(ruta, objeto_venta);
        if(response.status === "success"){
            await realizarCredito(response.message[1]);
            if(dbStore.v_.check_ticket_venta === true){
                buscarTicketVenta(response.message[1]);
            };
            mensaje_.value = `La venta ${response.message[1]} fue procesada satisfactoriamente!!!.`;

            dbStore.v_.array_venta = [{ id_sucursal: 0, suc: [], comprobante: '' }, []]
        }else{
            mensaje_.value = `sucedio un error: ${response.message}`;
        };
        modalStore.createMsj('showModalMsj', mensaje_.value, 2);
    };
    async function realizarCredito(numeracion_comprobante_venta){
        let credito = {
            "sucursal_cre": dbStore.v_.array_venta[0].id_sucursal,
            "tipo_comprobante": numeracion_comprobante_venta,
            "tasa": dbStore.v_.objeto_credito.tasa,
            "saldo_monto": dbStore.v_.objeto_credito.saldo_total - dbStore.v_.objeto_credito.saldo_interes,
            "saldo_interes": dbStore.v_.objeto_credito.saldo_interes,
            "saldo_total": dbStore.v_.objeto_credito.saldo_total,
            "fecha_cre": generarFecha()
        };

        let ruta = 'aperturar_creditos';
        let response_credito = Number(credito.saldo_monto) > 0 ? await enviarDatos(ruta, credito) : "";
        if(response_credito.status === 200){
            mensaje_.value = `${response_credito.message}`;
            dbStore.v_.objeto_credito = {
                sucursal_cre: 0,
                tipo_comprobante: '',
                tasa: 0,
                saldo_monto: 0,
                saldo_interes: 0,
                saldo_total: 0,
                fecha_cre: '',
            }
            dbStore.v_.objeto_modo_pago = {
                modo_efectivo: 0,
                modo_credito: 0,
                modo_tarjeta: 0,
                modo_perdida: 0,
                canal_venta: 0,
            }
        }else{
            mensaje_.value = `${response_credito.message}`;
        };
        modalStore.createMsj('showModalMsj', `${response_credito.message}`, 2);
    };
    async function buscarTicketVenta(dat){
        data_negocio.value = dbStore.db_negocio;

        data_venta.value = {
            tipo_comprobante: dat,
            sucursal_nombre: dbStore.db_sucursales.find(
                x => x.id_sucursales === dbStore.v_.array_venta[0].id_sucursal
            ).sucursal_nombre,
            fecha_det_ventas: generarFecha(),
            nombre_cli: dbStore.db_clientes[0].nombre_cli,
        };

        items_venta.value = dbStore.v_.array_venta[1].map(item => ({
            descripcion: item.descripcion,
            existencias: item[dbStore.v_.array_venta[0].suc[1]],
            precio: item.precio
        }));
        modalStore.crearModal('showModalTickets')
    };
    function usar(dato){
        dbStore.v_.cod_ventas = dato.codigo;
    }
</script>

<template>
    <div class="cuerpo">
        <div class="contenedor_botones_ventas botones-compras">
            <button id="apertura-caja" class="btnUno btn_venta_uno">Apertura de Caja</button>
            <button id="entradas-caja" class="btnUno marcaBotonDos btn_venta_uno">Entradas de Caja</button>
            <button id="salidas-caja" class="btnUno btn_venta_uno">Salidas de Caja</button>
        </div>
        <div class="contenedor-cuerpo-ventas">
            <div class="contenedor-ventas">
                
                <div style="display: grid;justify-items: center; background: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto));">
                    <form-cli 
                        :cliente="clienteSeleccionado"
                        :select="false"
                        :button="false"
                        title="Datos del cliente"
                        :button_dos="true"
                    />
                </div>
                <div>
                    <form-ventas />
                </div>
                <div>
                    <tab-venta 
                        :function_click="procesamientoVentas"
                    />
                </div>
            </div>
            <div>
                <form-bus-simple>
                    <template #actions="{ dato }">
                        <button style="cursor:pointer;" @click="usar(dato)">Usar</button>
                    </template>
                </form-bus-simple>
            </div>
        </div>
        <div v-if="modalStore.showModalTickets && data_negocio.length && Object.keys(data_venta).length" 
            :class="{ modal: true, 'modal-show': modalStore.showModalTickets }">
            <ticket-modal
                :data_negocio="data_negocio"
                :items_venta="items_venta"
                :data_venta="data_venta"
            />
        </div>
        <div :class="{ modal: true, 'modal-show': modalStore.showModalMsj.state }">
            <dial-mo-mensajes />
        </div>
    </div>
</template>

<style scoped>
.cuerpo{
  display: grid;
  gap: 10px;
}

.contenedor-cuerpo-ventas{
  display: grid;
  grid-template-columns: 2fr 1fr;
  width: 1100px;
  gap: 10px;
}
.contenedor-ventas{
  display: grid;
  gap: 10px;
}

</style>