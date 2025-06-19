<script setup>
    import { ref, defineProps, computed } from 'vue';
    import { useDataBases } from '../../stores/dataBases.js';
    import { useModalStore } from '../../stores/modalStore.js';
    import { generarFecha } from '../../services/functionFetch.js';
    import { enviarDatos } from '../../services/functionFetch.js';
    const props = defineProps({
        titulo:{
            type: String,
            required: true
        },
        db:{
            type: Array,
            required: true
        }
    });
    //states
    const mensaje_ = ref(''); // Estado para rastrear el mensaje de la modal
    const print = ref(false);
    const dbStore = useDataBases();
    const modalStore = useModalStore();

    
    const totalQAc = computed(() => props.db.reduce((sum, event) => sum + (event.q_ac || 0), 0));
    const totalQSu = computed(() => props.db.reduce((sum, event) => sum + (event.q_su || 0), 0));
    const totalQSd = computed(() => props.db.reduce((sum, event) => sum + (event.q_sd || 0), 0));
    const totalQSt = computed(() => props.db.reduce((sum, event) => sum + (event.q_st || 0), 0));
    const totalQSc = computed(() => props.db.reduce((sum, event) => sum + (event.q_sc || 0), 0));
    const total_compra = computed(() => props.db.reduce((sum, event) => sum + ((event.q_ac + event.q_su + event.q_sd + event.q_st + event.q_sc) * event.costo), 0).toFixed(2));

    function eliminarFila(codigo){
        const index = props.db.findIndex(item => item.codigo === codigo);
        if (index !== -1) {
            props.db.splice(index, 1);
        } else {
            mensaje_.value = `No se encontró el elemento con código: ${codigo}`;
            modalStore.createMsj('showModalMsj', mensaje_.value, 2);
        };
    };
    function eliminarProforma(){
        if(props.db === dbStore.c_.array_compras){
            dbStore.c_.array_compras = [];//Limpiar la lista de compras
            console.log('compras')
        }
        if(props.db === dbStore.r_.array_recompras){
            dbStore.r_.array_recompras = [];//Limpiar la lista de recompras
            console.log('recompras')
        }
    };
    async function procesamientoCompras(){
        try{
            if(props.db.length < 0){
                mensaje_.value = `Imposible procesar, la lista está vacía.`;
                modalStore.createMsj('showModalMsj', mensaje_.value, 2);
                return
            }
            if(print.value){
                modalStore.crearModal('showModalPrintPr');
            };
            if(props.db === dbStore.c_.array_compras){
                mensaje_.value = `Procesando la compra!!!.`;
                await funcionGeneralCompras();
            }
            if(props.db === dbStore.r_.array_recompras){
                mensaje_.value = `Procesando la recompra!!!.`;
                await funcionGeneralRecompras();
            }
        }catch(error){
            mensaje_.value = `Ocurrió un error. ${error}`;
        };
        modalStore.createMsj('showModalMsj', mensaje_.value, 2);
    };
    async function funcionGeneralCompras(){
        let array_productos = [];
        let array_entradas = [];
        function DatosProductos(a){
            this.categoria = a.categoria;
            this.codigo = a.codigo;
            this.descripcion = a.descripcion;
            this.talla = a.talla;
            this.existencias_ac = a.q_ac;
            this.existencias_su = a.q_su;
            this.existencias_sd = a.q_sd;
            this.existencias_st = a.q_st;
            this.existencias_sc = a.q_sc;
            this.costo_unitario = a.costo;
            this.precio_venta = a.precio;
            this.lote = a.lote;
            this.proveedor = a.proveedor;
        };
        function DatosEntradas(a, sucursal, operacion){
            this.codigo = a.codigo;
            this.sucursal = sucursal;
            this.existencias_entradas = a[operacion];
        };

        props.db.forEach((event)=>{
            array_productos.push(new DatosProductos(event))
            
            dbStore._sucursales_nombre.forEach((e)=>{
                let sucursal_ = dbStore.db_sucursales.find(x=> x.sucursal_nombre === e.name);
                if(sucursal_){
                    event[e.operacion] > 0 ? array_entradas.push(new DatosEntradas(event, sucursal_.id_sucursales, e.operacion)): "";
                };
            });
        });

        function DatosCompras(){
            this.id_num = dbStore.db_negocio[0].id;//Para la numeración
            this.fecha = generarFecha();
            this.array_productos = array_productos;
            this.array_entradas = array_entradas;
        };
        let ruta = 'gestion_de_compras'
        let objeto_compra = new DatosCompras();

        let response = await enviarDatos(ruta, objeto_compra);

        if(response.status === "success"){
            await dbStore.cargarProductosBuscar()
            await dbStore.crearDataBase('db_productos', 'almacen_central_ccd')
            
            mensaje_.value = `Operación "${response.message}" completada exitosamente.`;
            /* props.db = [];//Limpiar la lista de compras */
            dbStore.c_.array_compras = [];//Limpiar la lista de compras
        }else{
            mensaje_.value = `Ocurrió un error. ${response.message}`;
        };
    };

    async function funcionGeneralRecompras(){
        let array_productos_dos = [];
        let array_entradas_dos = [];
        function DatosProductosDos(a){
            this.idProd = a.idProd;
            this.existencias_ac = a.q_ac;
            this.existencias_su = a.q_su;
            this.existencias_sd = a.q_sd;
            this.existencias_st = a.q_st;
            this.existencias_sc = a.q_sc;
        };
        function DatosEntradasDos(a, sucursal, operacion){
            this.idProd = a.idProd;
            this.sucursal = sucursal;
            this.existencias_entradas = a[operacion];
        };
        props.db.forEach((event)=>{
            array_productos_dos.push(new DatosProductosDos(event))
            dbStore._sucursales_nombre.forEach((e)=>{
                let sucursal_ = dbStore.db_sucursales.find(x=> x.sucursal_nombre === e.name);
                if(sucursal_){
                    event[e.operacion] > 0 ? array_entradas_dos.push(new DatosEntradasDos(event, sucursal_.id_sucursales, e.operacion)): "";
                };
            });
        });

        function DatosRecompra(){
            this.id_num = dbStore.db_negocio[0].id;//Para la numeración
            this.fecha = generarFecha();
            this.array_productos_dos = array_productos_dos;
            this.array_entradas_dos = array_entradas_dos;
        };

        let ruta = 'gestion_de_recompras'
        let objeto_recompra = new DatosRecompra();

        let response = await enviarDatos(ruta, objeto_recompra);
        if(response.status === "success"){
            mensaje_.value = `Operación "${response.message}" completada exitosamente.`;
            /* props.db = [];//Limpiar la lista de compras */
            dbStore.r_.array_recompras = [];//Limpiar la lista de recompras
        }else{
            mensaje_.value = `Ocurrió un error. ${response.message}`;
        };
    };
    function printCheck() {
        print.value = !print.value; // Alterna el estado del checkbox
    }
</script>

<template>
  <div> 
    <table id="tabla_principal" class="tabla-proforma">
            <thead>
                <tr>
                    <th scope="row" colspan="16"><h2>{{ props.titulo }}</h2></th>
                </tr>
                <tr>
                    <th style="width: 100px;">Categoria</th>
                    <th style="width: 110px;">Código</th>
                    <th style="width: 150px;">Descripción</th>
                    <th style="width: 80px;">Medidas</th>
                    <th style="background: var(--suc-uno)">Q AC</th>
                    <th style="background: var(--suc-dos)">Q SU</th>
                    <th style="background: var(--suc-tres)">Q SD</th>
                    <th style="background: var(--suc-cuatro)">Q ST</th>
                    <th style="background: var(--suc-cinco)">Q SC</th>
                    <th style="width: 80px;">Costo Unitario</th>
                    <th style="width: 80px;">Costo Total</th>
                    <th style="width: 80px;">Precio de Venta</th>
                    <th>Lote</th>
                    <th>Proveedor</th>
                    <th id="remover-tabla-compras-dos">
                        <div class="btnDosB" @click="eliminarProforma()">
                            <span class="material-symbols-outlined">delete</span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in props.db" :key="event.codigo">
                    <td>{{ event.name_cat }}</td>
                    <td>{{ event.codigo }}</td>
                    <td>{{ event.descripcion }}</td>
                    <td style="text-align: center;">{{ event.talla }}</td>
                    <td style="text-align: right;">{{ event.q_ac }}</td>
                    <td style="text-align: right;">{{ event.q_su }}</td>
                    <td style="text-align: right;">{{ event.q_sd }}</td>
                    <td style="text-align: right;">{{ event.q_st }}</td>
                    <td style="text-align: right;">{{ event.q_sc }}</td>
                    <td style="text-align: right;">{{ event.costo }}</td>
                    <td style="text-align: right;">{{ ((event.q_ac + event.q_su + event.q_sd + event.q_st + event.q_sc) * event.costo).toFixed(2) }}</td>
                    <td style="text-align: right;">{{ event.precio }}</td>
                    <td style="text-align: center;">{{ event.lote }}</td>
                    <td>{{ event.name_prov }}</td>
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
                    <th scope="row" colspan="4" style="color: var(--side_uno);">Total</th>
                    <th style="text-align: right;color: var(--side_uno);">{{ totalQAc }}</th>
                    <th style="text-align: right;color: var(--side_uno);">{{ totalQSu }}</th>
                    <th style="text-align: right;color: var(--side_uno);">{{ totalQSd }}</th>
                    <th style="text-align: right;color: var(--side_uno);">{{ totalQSt }}</th>
                    <th style="text-align: right;color: var(--side_uno);">{{ totalQSc }}</th>
                    <th style="text-align: right;color: var(--side_uno);"></th>
                    <th style="text-align: right;color: var(--side_uno);">{{ total_compra }}</th>
                    <th scope="row" colspan="4" style="color: var(--side_uno);">
                        <label style="margin: 0 5px;" class="label-checkbox">Imprimir lista de compras 
                            <input type="checkbox" v-model="print" @click="printCheck()">
                        </label>
                    </th>
                </tr>
                <tr>
                    <th scope="row" colspan="16">
                        <button class="btnTres" @click="procesamientoCompras()">Procesar</button>
                    </th>
                </tr>
            </tfoot>
        </table>
  </div>
</template>

<style scoped>

</style>