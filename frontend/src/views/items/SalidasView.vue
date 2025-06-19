<script setup>
    import { ref } from 'vue';
    import TabInvUno from '../../components/tables/TabInvUno.vue';
    import TabMoDev from '../../components/modal/TabMoDev.vue';
    import DialMoMensajes from '../../components/modal/DialMoMensajes.vue';
    import { useModalStore } from '../../stores/modalStore';
    import { useDataBases } from '../../stores/dataBases';
    import { cargarDatos, enviarDatos, generarFecha } from '../../services/functionFetch';

    //states
    const columns = ref([//definimos la estructura de thead
        { key: 'sucursal_nombre', label: 'Sucursal', width: '140px', filterable: true, element: 'filtro_uno', fondo: '', alineacion: 'left' },
        { key: 'categoria_nombre', label: 'Categoría', width: '140px', filterable: true, element: 'filtro_dos', fondo: '', alineacion: 'left' },
        { key: 'codigo', label: 'Código', width: '80px', filterable: true, element: 'filtro_tres', fondo: '', alineacion: 'left' },
        { key: 'existencias_operacion', label: 'Q salidas', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'existencias_devueltas', label: 'Q devueltas', width: '80px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'precio_venta_salidas', label: 'Precio de venta', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'right' },
        { key: 'total_venta', label: 'Total venta', width: '100px', filterable: false, element: '', fondo: '', alineacion: 'right' },
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
        {conteo: 'salidas_conteo', tabla: 'salidas_tabla'},
        {conteo: 'transferencias_conteo_s', tabla: 'transferencias_tabla_s'},
    ]

    //methods
    function buildUrl(index, filters, inicio, fin, filtroSelect, num = null) {// definimos los datos de la ruta
        let fecha_inicio = ['2000-01-01', inicio];
        let fecha_fin = [new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), fin];
        let datos_ =    `sucursal_salidas=${filters.filtro_uno}&`+
                        `categoria_salidas=${filters.filtro_dos}&`+
                        `codigo_salidas=${filters.filtro_tres}&`+
                        `comprobante_salidas=${filters.filtro_cuatro}&`+
                        `fecha_inicio_salidas=${fecha_inicio[index]}&`+
                        `fecha_fin_salidas=${fecha_fin[index]}`;   

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
        if(dato.comprobante.startsWith('Ven')){
            titulo_.value = 'Procesar devolución'
            data_.value = dato;
            name_button_.value = 'Procesar devolución'
            modalStore.crearModal('showModalAcciones')
            modalStore.numerarEstadoModal('llenarShowModalAcciones', 3)
        }else{
            mensaje_.value = `¿Solo se puede procesar una venta"?.`
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
        let det_venta = await cargarDatos(`ventas_comprobante/${data_.value.comprobante}`)
        console.log(det_venta)
        
        
        let array_devolucion = [];
        let suma_perdida = 0;
        function DatosDevolucionSalidas(e){
            this.idProd = e.id_prod;
            this.sucursal_post = dbStore._sucursales_nombre.find(x => x.name === e.nombre_sucursal).stock;
            this.existencias_post = Number(e.input_number);

            this.id_op = e.id_operacion;

            this.comprobante = "Dev-" + e.comprobante;
            this.causa_devolucion = e.causa;
            this.precio_venta_salidas = Number(e.precio);
            this.sucursal = e.id_sucursal;
            this.cliente = e.cliente;
            suma_perdida += Number(e.input_number) * Number(e.precio);
        };
        dbStore.array_dev.forEach((e)=>{
            array_devolucion.push(new DatosDevolucionSalidas(e));
        });

        function DataDevoluciones(){
            this.array_devolucion = array_devolucion;
            this.id_det_ventas = det_venta[0].id_det_ventas;
            this.modo_perdida = suma_perdida;
            this.fecha = generarFecha();
        }
        let ruta = 'procesar_devolucion_salidas'
        let fila = new DataDevoluciones()

        console.log(fila)   
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
        row_title="Salidas" 
        :row_select="true" 
        :row_button="true" 
        :row_date="true" 
        :columns="columns" 
        :buildUrl="buildUrl" 
        idKey="idSal"
        :select="[
                { value: 0, text: 'Salidas' },
                { value: 1, text: 'Transferencias' },
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

    <details>
        <summary>Acciones</summary>
        <div>
            <div style="display: flex;gap: 10px;justify-content: space-between;margin: 5px;"><div class="material-symbols-outlined myButtonEditar">assignment_return</div>
                <span>Esta acción realiza devoluciones (solo aplica a ventas).</span></div>
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