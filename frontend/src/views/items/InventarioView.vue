<script setup>
    import { ref } from 'vue';
    import TabInvUno from '../../components/tables/TabInvUno.vue';
    import DialMoMensajes from '../../components/modal/DialMoMensajes.vue';
    import TabMoAcciones from '../../components/modal/TabMoAcciones.vue';
    import { useModalStore } from '../../stores/modalStore';
    import { useDataBases } from '../../stores/dataBases';
    import { enviarDatos, generarFecha } from '../../services/functionFetch';

    //states
    const columns = ref([//definimos la estructura de thead
        { key: 'categoria_nombre', label: 'Categoría', width: '180px', filterable: true, element: 'filtro_uno', fondo: '', alineacion: 'left' },
        { key: 'codigo', label: 'Código', width: '80px', filterable: true, element: 'filtro_dos', fondo: '', alineacion: 'left' },
        { key: 'descripcion', label: 'Descripción', width: '160px', filterable: true, element: 'filtro_tres', fondo: '', alineacion: 'left' },
        { key: 'talla', label: 'Medidas', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'center' },
        { key: 'existencias_ac', label: 'Q AC', width: '50px', filterable: false, element: '', fondo: 'var(--suc-uno)', alineacion: 'right' },
        { key: 'existencias_su', label: 'Q S1', width: '50px', filterable: false, element: '', fondo: 'var(--suc-dos)', alineacion: 'right' },
        { key: 'existencias_sd', label: 'Q S2', width: '50px', filterable: false, element: '', fondo: 'var(--suc-tres)', alineacion: 'right' },
        { key: 'existencias_st', label: 'Q S3', width: '50px', filterable: false, element: '', fondo: 'var(--suc-cuatro)', alineacion: 'right' },
        { key: 'existencias_sc', label: 'Q S4', width: '50px', filterable: false, element: '', fondo: 'var(--suc-cinco)', alineacion: 'right' },
        { key: 'costo_unitario', label: 'Costo Unitario', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'total_costo', label: 'Costo Total', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'precio_venta', label: 'Precio de Venta', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'lote', label: 'Lote', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'center' },
        { key: 'nombre_cli', label: 'Proveedor', width: '100px', filterable: true, element: 'filtro_cuatro', fondo: '', alineacion: 'left' },
    ]);
    const id_ = ref(null)
    const codigo_ = ref('')
    const mensaje_ = ref('')
    const opcionUno_ = ref(false)
    const opcionDos_ = ref(false)

    const titulo_ = ref('')
    const data_ = ref({})
    const data_etiqueta = ref({})
    const etiquetas = ref([]);
    const name_button_ = ref('')

    const modalStore = useModalStore();
    const dbStore = useDataBases();

    //methods
    function buildUrl(index, filters, inicio, fin, filtroSelect, num = null) {// definimos los datos de la ruta
        
        let datos_ =    `categoria_producto=${filters.filtro_uno}&` +
                        `codigo_producto=${filters.filtro_dos}&` +
                        `descripcion_producto=${filters.filtro_tres}&` +
                        `proveedor_producto=${filters.filtro_cuatro}&`;

        let url = `almacen_central_conteo?` + datos_;
                    
        if (num !== null) {
            url = `almacen_central_tabla/${num}?` + datos_;
        }
        return url;
    }

    function aperturarModalEliminar(id, codigo, descripcion){
        mensaje_.value = `¿Desea eliminar el producto "${ codigo }", ${descripcion}?.`
        opcionUno_.value = true
        opcionDos_.value = false
        modalStore.crearModal('showModalMensajes')
        id_.value = id
        codigo_.value = codigo
    };
    function aperturarModalRecompra(dato){
        titulo_.value = 'Recomprar'
        data_.value = dato;
        name_button_.value = 'Procesar recompra'
        modalStore.crearModal('showModalAcciones')
        modalStore.numerarEstadoModal('llenarShowModalAcciones', 1)
    }
    function aperturarModalTransferencia(dato){
        titulo_.value = 'Transferencia'
        data_.value = dato;
        name_button_.value = 'Procesar transferencia'
        modalStore.crearModal('showModalAcciones')
        modalStore.numerarEstadoModal('llenarShowModalAcciones', 2)
    }

    async function procesarAcciones(){
        mensaje_.value = `Procesando!!!.`
        modalStore.crearModal('showModalMensajes')
        let inputs = document.querySelectorAll(".q_");
        let texts_saldos = document.querySelectorAll(".s_");
        let valores = Array.from(inputs).map(input => Number(input.value));
        let valores_saldos = Array.from(texts_saldos).map(texts_saldos => Number(texts_saldos.textContent));

        if (valores.every(valor => valor >= 0 && Number.isFinite(valor)) && valores.some(valor => valor > 0) &&
        valores_saldos.every(valor => valor >= 0 && Number.isFinite(valor))){
            try{
                if(modalStore.llenarShowModalAcciones === 1){
                    await realizarRecompra();
                }else if(modalStore.llenarShowModalAcciones === 2){
                    await realizarTransferencia();
                }
            }catch (error){
                mensaje_.value = `Ocurrió un error. "${error}"`
                opcionDos_.value = true
            };
        }else{
            mensaje_.value = `Uno o varios de los valores son incorrectos.`
            opcionDos_.value = true
        };
    };
    async function realizarRecompra(){
        let array_productos_dos = [];
        let array_entradas_dos = [];
        function DataProductos(){
            this.idProd = Number(data_.value.idProd);
            dbStore._sucursales_nombre.forEach((sucursal)=>{
                let coincidencia = dbStore.array_com_tra.find(x => x.nombre_sucursal === sucursal.name);
                coincidencia ?  this[sucursal.stock] = Number(coincidencia.input_number): 
                                this[sucursal.stock] = 0;
            });
        };
        array_productos_dos.push(new DataProductos())
        function DatosEntradas(existencias, sucursal){
            this.idProd = Number(data_.value.idProd);
            this.existencias_entradas = existencias;
            this.sucursal = sucursal;
        }
        dbStore.array_com_tra.forEach((event)=>{
            if(event.input_number > 0){
                array_entradas_dos.push(new DatosEntradas(event.input_number, event.id_sucursal))
            }
        })
        function DataRecompras(){
            this.id_num = dbStore.db_negocio[0].id;
            this.fecha = generarFecha();
            this.array_productos_dos = array_productos_dos;
            this.array_entradas_dos = array_entradas_dos;
        };
        let fila_recompra = new DataRecompras();
        let ruta = 'gestion_de_recompras';
        let response = await enviarDatos(ruta, fila_recompra)
        if(response.status === "success"){
            mensaje_.value = `La ${response.message} se ejecutó satisfactoriamente.`
            opcionDos_.value = true
            modalStore.eliminarModal('showModalAcciones')//eliminamos el modal de acciones
            dbStore.habilitarRecarga('recarga_tabla')//con esto actualizamos la tabla
            modalStore.llenarShowModalAcciones = 0;
        }else if(response.status === "error"){
            mensaje_.value = `Ocurrió un error. "${response.message}"`
            opcionDos_.value = true
        };
    };

    async function realizarTransferencia(){
        let array_data_prod = [];
        let array_data_tran = [];
        function DataProductos(){
            let suma = dbStore.array_com_tra.reduce((acumulador, valor) => acumulador + Number(valor.input_number), 0);
            this.idProd = Number(data_.value.idProd)
            dbStore._sucursales_nombre.forEach((sucursal)=>{
                let coincidencia = dbStore.array_com_tra.find(x => x.nombre_sucursal === sucursal.name);
                coincidencia ?  coincidencia.input_check ?  this[sucursal.stock] = -suma: 
                                                            this[sucursal.stock] = Number(coincidencia.input_number):
                                this[sucursal.stock] = 0;
            });
        };
        array_data_prod.push(new DataProductos())

        function DataTransferencia(existencias, sucursal_origen, sucursal_destino){
            this.idProd = Number(data_.value.idProd)
            this.cantidad = existencias;
            this.id_suc_origen = sucursal_origen;
            this.id_suc_destino = sucursal_destino;
        };
        let suc_o = dbStore.array_com_tra.find(x => x.input_check === true);
        dbStore.array_com_tra.forEach((event)=>{
            if(event.input_number > 0){
                array_data_tran.push(new DataTransferencia(event.input_number, suc_o.id_sucursal, event.id_sucursal))
            }
        })

        function DatosTransferencia(){
            this.id_num = dbStore.db_negocio[0].id;
            this.array_data_prod = array_data_prod;
            this.array_data_tran = array_data_tran;
            this.fecha = generarFecha();
        }

        let fila = new DatosTransferencia();
        let ruta = 'procesar_transferencia'
        let response = await enviarDatos(ruta, fila)
        if(response.status === "success"){
            mensaje_.value = `La transferencia "${response.message}" fue procesada satisfactoriamente!!!.`
            opcionDos_.value = true
            modalStore.eliminarModal('showModalAcciones')//eliminamos el modal de acciones
            dbStore.habilitarRecarga('recarga_tabla')//con esto actualizamos la tabla
            modalStore.llenarShowModalAcciones = 0;
        }else if(response.status === "error"){
            mensaje_.value = `Ocurrió un error. "${response.message}"`
            opcionDos_.value = true
        };
    };





    function accionEliminar(){
        console.log('Accion eliminar')
    }

    async function generarEtiqueta(dato) {
        data_etiqueta.value = dato;
        let codigo_Array = etiquetas.value.map(etiqueta => etiqueta.codigo);
        let busqueda_repetido = codigo_Array.find(x => x === data_etiqueta.value.codigo)
        if(busqueda_repetido === undefined){
            etiquetas.value.push({
                codigo: data_etiqueta.value.codigo,
                descripcion: data_etiqueta.value.descripcion,
                precio_venta: data_etiqueta.value.precio_venta,
                cantidad: data_etiqueta.value.existencias_ac + 
                            data_etiqueta.value.existencias_su + 
                            data_etiqueta.value.existencias_sd + 
                            data_etiqueta.value.existencias_st +
                            data_etiqueta.value.existencias_sc
            });
            mensaje_.value = `El código "${data_etiqueta.value.codigo}" fue ingresado a cola de impresión.`
            /* generarCodigoBarras()
            generarCodigoQr() */
        } else {
            mensaje_.value = `El código "${data_etiqueta.value.codigo}" ya existe en la cola de impresión.`
        }
        opcionUno_.value = false
        opcionDos_.value = true
        modalStore.crearModal('showModalMensajes')
    };
    function eliminarFila(index){
        etiquetas.value.splice(index, 1);
    }
</script>

<template>
  <div>
    <div class="tabla-proforma">
        <h1>Grafico stock</h1>
    </div>
    
    <div :class="{ modal: true, 'modal-show': modalStore.showModalAcciones}">
        <tab-mo-acciones 
            :titulo="titulo_"
            :data="data_"
            :name_button="name_button_"
            :clickFuncion="procesarAcciones"
            :db_data_sucursales="dbStore.db_sucursales"
        />
    </div>
    <div :class="{ modal: true, 'modal-show': modalStore.showModalMensajes }">
        <dial-mo-mensajes 
            :mensaje='mensaje_'
            :clickFuncion="accionEliminar"
            :opcionUno="opcionUno_"
            :opcionDos="opcionDos_"
        />
    </div>
    <div>
        <tab-inv-uno 
        row_title="Inventarios" 
        :row_select="false" 
        :row_button="true" 
        :row_date="false" 
        :columns="columns" 
        :buildUrl="buildUrl" 
        idKey="idProd"
        >
            <template #actions="{ dato }">
                <!-- <div>{{ dato }}</div> -->
                <div class="tooltip">
                    <button class="btnUnoB" @click="generarEtiqueta(dato)">
                        <span style="font-size:18px;" class="material-symbols-outlined">print</span>
                        <span class="tooltiptext">Imprimir código</span>
                    </button>
                </div>
                <div class="tooltip">
                    <button class="btnUnoB" @click="aperturarModalRecompra(dato)">
                        <span style="font-size:18px;" class="material-symbols-outlined">shopping_cart</span>
                        <span class="tooltiptext">Recompra</span>
                    </button>
                </div>                    
                <div class="tooltip">
                    <button class="btnUnoB" @click="aperturarModalTransferencia(dato)">
                        <span style="font-size:18px;" class="material-symbols-outlined">move_up</span>
                        <span class="tooltiptext">Transferencia</span>
                    </button>
                </div>
                <div class="tooltip">
                    <button class="btnDosB" @click="aperturarModalEliminar(dato.idProd, dato.codigo, dato.descripcion)">
                        <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                        <span class="tooltiptext">Eliminar producto</span>
                    </button>
                </div>
            </template>
        </tab-inv-uno >
    </div>
    <br>
    <div class="contenedor-codigo-barras">
        <table id="tabla-codigo-barras" class="tabla-proforma">
            <thead class="elemento_estatico_superior">
                <tr>
                    <th scope="row" colspan="7"><h2>Impresión de etiquetas</h2></th>
                </tr>
                <tr>
                    <th scope="row" colspan="7">Tabla de Etiquetas</th>
                </tr>
                <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th style="width: 200px;">Cod. Barras</th>
                    <th style="width: 200px;">Cod. QR</th>
                    <th>X</th>
                </tr>
            </thead>
            <tbody class="contenedor_body">
                <tr v-for="(etiqueta, index) in etiquetas" :key="index">
                    <td>{{ etiqueta.codigo }}</td>
                    <td>{{ etiqueta.descripcion }}</td>
                    <td>{{ etiqueta.precio_venta }}</td>
                    <td style="display: flex; justify-content: center;">
                        <input class="input-numero" :value="etiqueta.cantidad">
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <div class="tooltip">
                            <button class="btnDosB" @click="eliminarFila(index)">
                                <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                                <span class="tooltiptext">Eliminar producto</span>
                            </button>
                        </div>
                    </td>

                </tr>
            </tbody>
            <tfoot class="elemento_estatico_inferior">
                <tr>
                    <th scope="row" colspan="10">
                        <div style="display: flex; justify-content: center; gap: 20px;">

                            <button id="crear-codigo-barras" class="btnUnoB">Crear Código De Barras</button>
                            <button id="crear-codigo-qr" class="btnUnoB">Crear Código QR</button>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
    
        
    

    <div id="acciones_rapidas" class="contenedor-pre-recompra">
    </div>
    <details>
        <summary>Acciones</summary>
        <div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined myButtonEditar">print</div>
                <span>Esta acción manda a cola de impresión de etiquetas de código de barras o qr.</span></div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined myButtonEditar">shopping_cart</div>
                <span>Con esta acción se realiza la recompra de un producto existente.</span></div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined myButtonEditar">move_up</div>
                <span>Con esta acción se puede transferir una determinada cantidad de cada producto entre las sucursales existentes.</span></div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined eliminarTablaFila">delete</div>
                <span>Esta acción elimina un producto con todas sus operaciones y resportes de compra y venta.</span></div>
        </div>
    </details>
    
  </div>
</template>

<style scoped>
.title{
  color: rgb(25, 0, 255);
}
</style>