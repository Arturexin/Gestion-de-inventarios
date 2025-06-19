<script setup>
    import { ref } from 'vue';
    import TabInvUno from '../../components/tables/TabInvUno.vue';
    import FormCli from '../../components/forms/FormCli.vue';

    import { enviarDatos } from '../../services/functionFetch';
    import { useDataBases } from '../../stores/dataBases';

    import { useModalStore } from '../../stores/modalStore';
    import DialMoMensajes from '../../components/modal/DialMoMensajes.vue';

    
    //states
    const clientesStore = useDataBases();
    const modalStore = useModalStore();
    const clienteSeleccionado = ref(null);//creamos el estado que recibirá los datos de la tabla y pasaremos a FromCli.vue
    const columns = ref([//definimos la estructura de thead
        { key: 'nombre_cli', label: 'Nombre', width: '180px', filterable: true, element: 'filtro_uno' },
        { key: 'dni_cli', label: 'DNI / RUC', width: '80px', filterable: true, element: 'filtro_dos' },
        { key: 'email_cli', label: 'Email', width: '160px', filterable: true, element: 'filtro_tres' },
        { key: 'telefono_cli', label: 'Teléfono', width: '100px', filterable: true, element: 'filtro_cuatro' },
        { key: 'direccion_cli', label: 'Dirección', width: '200px', filterable: false, element: 'direccion_cli' },
        { key: 'nombres', label: 'Usuario', width: '100px', filterable: true, element: 'filtro_cinco' },
        { key: 'fecha_cli', label: 'Fecha', width: '100px', filterable: false, element: 'fecha_cli' },
    ]);

    const id_ = ref(null)
    const nombre_ = ref('')
    const mensaje_ = ref('')
    const opcionUno_ = ref(false)
    const opcionDos_ = ref(false)

    //methods
    function buildUrl(index, filters, inicio, fin, filtroSelect, num = null) {// definimos los datos de la ruta
        
        let fecha_inicio = ['2000-01-01', inicio];
        let fecha_fin = [new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(), fin];
        let datos_ =    `nombre_persona=${filters.filtro_uno}&` +
                        `dni_persona=${filters.filtro_dos}&` +
                        `email_persona=${filters.filtro_tres}&` +
                        `telefono_persona=${filters.filtro_cuatro}&` +
                        `usuario_persona=${filters.filtro_cinco}&` +
                        `clase_persona=${filtroSelect}&` +
                        `fecha_inicio_persona=${fecha_inicio[index]}&` +
                        `fecha_fin_persona=${fecha_fin[index]}`;

        let url = `clientes_conteo?` + datos_;
                    
        if (num !== null) {
            url = `clientes_tabla/${num}?` + datos_;
        }
        return url;
    }

    async function eliminarCliente() {
            let ruta = 'clientes_remove'
            let data = {
                'id_cli': id_.value,
            };
            let response = await enviarDatos(ruta, data);
            if(response.status === "success"){
                if(document.querySelector("#filtro-tabla-clientes-clase").value > 0){
                    clientesStore.eliminarDatoADataBase('db_proveedores', 'id_cli', id_.value); // Actualizamos el estado global                     
                    console.log(clientesStore.db_clientes)
                }else {
                    clientesStore.eliminarDatoADataBase('db_clientes', 'id_cli', id_.value); // Actualizamos el estado global
                    console.log(clientesStore.db_proveedores)
                };
                
                mensaje_.value = `${response.message}, "${nombre_.value}"`
                opcionUno_.value = false
                opcionDos_.value = true
            }else{
                mensaje_.value = `No se puede eliminar el cliente "${ nombre_.value }".`
                console.log('No se puede eliminar al cliente')
            };
    };
    function aperturarModalEliminar(id, nombre){
        mensaje_.value = `¿Desea eliminar el cliente "${ nombre }"?.`
        opcionUno_.value = true
        opcionDos_.value = false
        modalStore.crearModal('showModalMensajes')
        id_.value = id
        nombre_.value = nombre
    };
    function aperturarModalReporte(){
        mensaje_.value = `Aperturar nueva ventada de reporte.`
        opcionUno_.value = false
        opcionDos_.value = true
        modalStore.crearModal('showModalMensajes')
    }
    function aperturarModalEditar(dato){
        console.log(dato)
        mensaje_.value = `Editar el cliente "${ dato.nombre_cli }".`
        opcionUno_.value = false
        opcionDos_.value = true
        clienteSeleccionado.value = dato;
        modalStore.crearModal('showModalMensajes')
    }
</script>

<template>
  <div class="contenedor-formularios">
    <div class="contenedor-formularios-into">
        <form-cli 
            :cliente="clienteSeleccionado"
            :select="true"
            :button="true"
            title="Ingresar Cliente / Proveedor"
            :button_dos="false"
        />
        <div style="padding: 20px 0;">
            <div class="titulo_graficos"><p>Total Clientes y Proveedores</p></div>  
            <!-- <GrafBarrasVertical /> -->
            <!-- <div id="contenedor_clientes_proveedores">
            </div> -->
        </div>
    </div>
    <div :class="{ modal: true, 'modal-show': modalStore.showModalMensajes }">
        <dial-mo-mensajes 
            :mensaje='mensaje_'
            :clickFuncion="eliminarCliente"
            :opcionUno="opcionUno_"
            :opcionDos="opcionDos_"
        />
    </div>
    <div class="contenedor_tabla">
        <tab-inv-uno
            :row_select="true" 
            :row_button="true" 
            :row_date="true" 
            :columns="columns" 
            :buildUrl="buildUrl" 
            idKey="id_cli"
            :select="[
                { value: 0, text: 'Clientes' },
                { value: 1, text: 'Proveedores' }
            ]"
        >
            <template #actions="{ dato }">
                <!-- <div>{{ dato }}</div> -->
                <div class="tooltip">
                    <button class="btnUnoB" @click="aperturarModalEditar(dato)">
                        <span style="font-size:18px;" class="material-symbols-outlined">edit</span>
                    </button>
                    <span class="tooltiptext">Editar cliente</span>
                </div>
                <div class="tooltip">
                    <button class="btnUnoB" @click="aperturarModalReporte()">
                        <span style="font-size:18px;" class="material-symbols-outlined">insert_chart</span>
                        <span class="tooltiptext">Reporte de consumos</span>
                    </button>
                </div>
                <div class="tooltip">
                    <!-- <button class="btnDosB" @click="eliminarCliente(dato.id_cli, dato.nombre_cli)"> -->
                    <button class="btnDosB" @click="aperturarModalEliminar(dato.id_cli, dato.nombre_cli)">
                        <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                        <span class="tooltiptext">Eliminar cliente</span>
                    </button>
                </div>
            </template>
        </tab-inv-uno>
    </div>
    <div class="tabla-proforma">
        <h2 style="text-align: center; margin: 10px;">Volcado de datos (.csv)
            <div class="tooltip_ayuda">
                <span class="material-symbols-outlined">help</span>
                <span class="tooltiptext_ayuda">Este apartado está destinado a migrar datos de una lista de clientes externa.</span>
            </div>
        </h2>
        <hr><br>
        <p style="text-align: center;">Por favor, asegúrate de que los archivos que utilices estén en formato CSV.</p>
        <div style="text-align: center;">
            <label>Clientes<input type="radio" id="_radio_clientes" class="_radio_cp" name="cli_pro" checked></label>
            <label>Proveedores<input type="radio" id="_radio_proveedores" class="_radio_cp" name="cli_pro"></label>
            <div class="tooltip_ayuda">
                <span class="material-symbols-outlined">help</span>
                <span class="tooltiptext_ayuda">Asegurese de que contenga solo un tipo de persona por lista.</span>
            </div>
        </div>
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
  </div>
</template>

<style scoped>


</style>