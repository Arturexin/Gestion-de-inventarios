<script setup>
    import { ref } from 'vue';
    import TabInvUno from '../../components/tables/TabInvUno.vue';
    import TabMoDev from '../../components/modal/TabMoDev.vue';
    import DialMoMensajes from '../../components/modal/DialMoMensajes.vue';
    import { useModalStore } from '../../stores/modalStore';
    import { useDataBases } from '../../stores/dataBases';
    import { enviarDatos, generarFecha } from '../../services/functionFetch';

    //states
    const columns = ref([//definimos la estructura de thead
        { key: 'sucursal_nombre', label: 'Sucursal', width: '140px', filterable: true, element: 'filtro_uno', fondo: '', alineacion: 'left' },
        { key: 'categoria_nombre', label: 'Categoría', width: '140px', filterable: true, element: 'filtro_dos', fondo: '', alineacion: 'left' },
        { key: 'codigo', label: 'Código', width: '80px', filterable: true, element: 'filtro_tres', fondo: '', alineacion: 'left' },
        { key: 'existencias_operacion', label: 'Q entradas', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'existencias_devueltas', label: 'Q devueltas', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'costo_unitario', label: 'Costo Unitario', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'total_costo', label: 'Total costo', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'comprobante', label: 'Operación', width: '140px', filterable: true, element: 'filtro_cuatro', fondo: '', alineacion: 'left' },
        { key: 'fecha', label: 'Fecha', width: '90px', filterable: false, element: '', fondo: '', alineacion: 'center' },
    ]);
    const id_ = ref(null)
    const codigo_ = ref('')
    const mensaje_ = ref('')
    const opcionUno_ = ref(false)
    const opcionDos_ = ref(false)

    const titulo_ = ref('')
    const data_ = ref({})
    const name_button_ = ref('')

    const modalStore = useModalStore();
    const dbStore = useDataBases();

    const opcion_db = [
        {conteo: 'entradas_conteo', tabla: 'entradas_tabla'},
        {conteo: 'transferencias_conteo', tabla: 'transferencias_tabla'},
        {conteo: 'perdidas_conteo', tabla: 'perdidas_tabla'}
    ]

    //methods
    function buildUrl(index, filters, inicio, fin, filtroSelect, num = null) {// definimos los datos de la ruta
        let fecha_inicio = ['2000-01-01', inicio];
        let fecha_fin = [new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), fin];
        let datos_ =    `sucursal_entradas=${filters.filtro_uno}&`+
                        `categoria_entradas=${filters.filtro_dos}&`+
                        `codigo_entradas=${filters.filtro_tres}&`+
                        `comprobante_entradas=${filters.filtro_cuatro}&`+
                        `fecha_inicio_entradas=${fecha_inicio[index]}&`+
                        `fecha_fin_entradas=${fecha_fin[index]}`;

        let url = `${opcion_db[filtroSelect].conteo}?` + datos_;
                    
        if (num !== null) {
            url = `${opcion_db[filtroSelect].tabla}/${num}?` + datos_;
        }
        return url;
    }

    function aperturarModalEliminar(id, codigo, comprobante){
        mensaje_.value = `¿Desea eliminar la operacion "${ comprobante }", con código ${codigo}?.`
        opcionUno_.value = true
        opcionDos_.value = false
        modalStore.crearModal('showModalMensajes')
        id_.value = id
        codigo_.value = codigo
    };
    function aperturarModalDevolucion(dato){
        if(dato.comprobante.startsWith('Com') || dato.comprobante.startsWith('Rec')){
            titulo_.value = 'Procesar devolución'
            data_.value = dato;
            name_button_.value = 'Procesar devolución'
            modalStore.crearModal('showModalAcciones')
            modalStore.numerarEstadoModal('llenarShowModalAcciones', 3)
        }else{
            mensaje_.value = `¿Solo se puede procesar una compra o recompra"?.`
            opcionUno_.value = false
            opcionDos_.value = true
            modalStore.crearModal('showModalMensajes')
        }
    }
    async function procesarAcciones(){
        mensaje_.value = `Procesando!!!.`
        modalStore.crearModal('showModalMensajes')
        let inputs = document.querySelectorAll(".q_");
        let texts_saldos = document.querySelectorAll(".s_");
        let valores = Array.from(inputs).map(input => Number(input.value));
        let valores_saldos = Array.from(texts_saldos).map(texts_saldos => Number(texts_saldos.textContent));
        if (valores.every(valor => valor >= 0 && Number.isFinite(valor)) && valores.some(valor => valor > 0) &&
        valores_saldos.every(valor => valor >= 0 && Number.isFinite(valor)) && document.getElementById("select_causas").value !== "0") {
            try{
                await realizarDevolucion();
            }catch(error){
                mensaje_.value = `Ocurrió un error. "${error}"`
                opcionDos_.value = true
            };
        }else{
            mensaje_.value = `Uno o varios de los valores son incorrectos.`
            opcionDos_.value = true
        };
    }
    async function realizarDevolucion(){
        let array_devolucion = [];
        function DatosDeDevolucionCompras(e){
                this.idProd = e.id_prod;
                this.sucursal_post = dbStore._sucursales_nombre.find(x => x.name === e.nombre_sucursal).stock;
                this.existencias_post = e.input_number;

                this.id_op = e.id_operacion;

                this.comprobante = "Dev-" + e.comprobante;
                this.causa_devolucion = e.causa;
                this.sucursal = e.id_sucursal;
        };
        dbStore.array_dev.forEach((e)=>{
            array_devolucion.push(new DatosDeDevolucionCompras(e));
        });

        function DataDevoluciones(){
            this.array_devolucion = array_devolucion;
            this.fecha = generarFecha();
        }
        let fila = new DataDevoluciones()

        let ruta = 'procesar_devolucion_compras'
        let response = await enviarDatos(ruta, fila)

        if(response.status === "success"){
            mensaje_.value = `${response.message}`
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
</script>

<template>
  <div>
    
    <div :class="{ modal: true, 'modal-show': modalStore.showModalAcciones}">
        <tab-mo-dev 
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
        row_title="Entradas" 
        :row_select="true" 
        :row_button="true" 
        :row_date="true" 
        :columns="columns" 
        :buildUrl="buildUrl" 
        idKey="idEntr"
        :select="[
                { value: 0, text: 'Entradas' },
                { value: 1, text: 'Transferencias' },
                { value: 2, text: 'Despacho' },
            ]"
        >
            <template #actions="{ dato }">
                <div class="tooltip">
                    <button class="btnUnoB" @click="aperturarModalDevolucion(dato)">
                        <span style="font-size:18px;" class="material-symbols-outlined">assignment_return</span>
                        <span class="tooltiptext">Devolver</span>
                    </button>
                </div>
                <div class="tooltip">
                    <button class="btnDosB" @click="aperturarModalEliminar(dato.idEntr, dato.codigo, dato.comprobante)">
                        <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                        <span class="tooltiptext">Eliminar operación</span>
                    </button>
                </div>
            </template>
        </tab-inv-uno >
    </div>

    <div class="tabla-proforma">
        <h2 style="text-align: center; margin: 10px;">Volcado de datos (.csv)
            <div class="tooltip_ayuda">
                <span class="material-symbols-outlined">help</span>
                <span class="tooltiptext_ayuda">Este apartado está destinado a migrar datos de una lista de productos externa.</span>
            </div>
        </h2>
        <hr><br>
        <p style="text-align: center;">Por favor, asegúrate de que los archivos que utilices estén en formato CSV.</p>
        <div style="display: grid;justify-content: center; margin: 10px;">
            <div style="display: flex; justify-content: center;">
                <button id="exportar_formato">Descargar formato CSV</button>
                <div class="tooltip_ayuda">
                    <span class="material-symbols-outlined">download</span>
                    <span class="tooltiptext_ayuda">Despues de hacer la descarga debe acomodar sus datos de acuerdo a este formato.</span>
                </div>
            </div>
            <div style="display: flex; justify-content: center;">
                <input type="file" id="carga_archivo" class="input_file_upload">
                <div class="tooltip_ayuda">
                    <span class="material-symbols-outlined">upload</span>
                    <span class="tooltiptext_ayuda">Solo podrá volcar los datos si cumple con el formato previamente descargado.</span>
                </div>
            </div>
            <button id="volcar_datos" class="myButtonEditar">Volcar</button>
        </div>
    </div>
    <details>
        <summary>Acciones</summary>
        <div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined myButtonEditar">assignment_return</div>
                <span>Esta acción realiza devoluciones (solo aplica a compras y recompras).</span></div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined eliminarTablaFila">delete</div>
                <span>Esta acción elimina las operaciones realizadas de este producto.</span></div>
        </div>
    </details>
  </div>
</template>

<style scoped>
.title{
  color: rgb(25, 0, 255);
}
</style>