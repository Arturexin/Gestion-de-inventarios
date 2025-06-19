<script setup>
    import { ref, watch, onMounted } from 'vue';
    import { useDataBases } from '../../stores/dataBases';
    import { cargarDatos } from '../../services/functionFetch';

    //props
    const props = defineProps({
        columns:{
            type: Array,
            required: true
        },
        buildUrl: {
            type: Function,
            required: true
        },
        idKey: {
            type: String,
            required: true
        },
        select: {
            type: Array,
            required: false,
            default: () => [
                { value: 0, text: 'Cero' },
                { value: 1, text: 'Uno' }
            ]
        },
        row_select: {
            type: Boolean,
            required: false,
        },
        row_button: {
            type: Boolean,
            required: false,
        },
        row_date: {
            type: Boolean,
            required: false,
        },
        row_title: {
            type: String,
            required: false,
        },clickFunctionReportes: {
            type: Function,
            required: false
        },
    })
    //states
    const dbStore = useDataBases();
        //elementos html
    const input_fecha_inicio = ref('');
    const input_fecha_fin = ref('');
    
    const input_indice_grupo = ref('');// ES EL SELECT contiene la indexacion de los grupos

    const num_grupos = ref(0); //contiene el número de grupos de la tabla clientes
    const num_filas_db = ref(0);// contiene el conteo de filas de la tabla clientes
    const sum_num_indices = ref(1);// inicializa el primer valor del indice de grupos
    const sum_num_filas = ref(0);// iniciamos en cero
    const base_datos = ref([]);// contiene datos de la tabla clientes
    const inicio = ref(0);
    const fin = ref(0);
    const filters = ref({
        filtro_cero: 0,//reservado para select
        filtro_uno: '',
        filtro_dos: '',
        filtro_tres: '',
        filtro_cuatro: '',
        filtro_cinco: '',
    });

    //methos
    // Obteniendo número de grupos de 20 filas
    async function conteoFilas(sub_ruta, num_filas_db, input_indice_grupo, sum_num_indices,num){
        try {
            num_filas_db.value = await cargarDatos(sub_ruta)
            num_grupos.value = Math.ceil(num_filas_db.value/num)
            input_indice_grupo.value = sum_num_indices.value
        } catch (error) {
            console.error('Error en conteoFilas:', error);
        };
    };
    function subRutaA(index) {
        return props.buildUrl(index, filters.value, inicio.value, fin.value, filters.value.filtro_cero);
    }

    //Obteniendo grupo de datos de 20 filas
    async function searchDatos(sub_ruta, datos) {
        try {
            datos.value = await cargarDatos(sub_ruta);
        } catch (error) {
            console.error('Error en searchDatos:', error);
        }
    }
    function subRutaB(num, index) {
        return props.buildUrl(index, filters.value, inicio.value, fin.value, filters.value.filtro_cero, num);
    }
    /////////////////////////
    async function avanzar(){
        if(sum_num_filas.value + 20 < num_filas_db.value){
            sum_num_indices.value += 1;
            sum_num_filas.value += 20;
            input_indice_grupo.value = sum_num_indices.value
            manejoDeFechas()
            await searchDatos(subRutaB(Number(sum_num_filas.value), 1), base_datos)
        };
    };
    async function avanzarFinal() {
        if(input_indice_grupo.value < Math.ceil(num_filas_db.value/20)){
            sum_num_indices.value = Math.ceil(num_filas_db.value/20)
            sum_num_filas.value = Math.floor(num_filas_db.value/20) * 20 === num_filas_db.value ? 
                                    num_filas_db.value - 20 : Math.floor(num_filas_db.value/20) * 20
            input_indice_grupo.value = sum_num_indices.value
            manejoDeFechas()
            await searchDatos(subRutaB(sum_num_filas.value, 1), base_datos)

        };
    };
    async function retroceder(){
        if(sum_num_indices.value > 1){
            sum_num_indices.value -= 1
            sum_num_filas.value -= 20
            input_indice_grupo.value = sum_num_indices.value
            manejoDeFechas()
            await searchDatos(subRutaB(Number(sum_num_filas.value), 1), base_datos)

        };
    };
    async function retrocederInicio() {
        if(sum_num_indices.value > 1){
            sum_num_indices.value = 1
            sum_num_filas.value = 0
            input_indice_grupo.value = sum_num_indices.value
            manejoDeFechas()
            await searchDatos(subRutaB(sum_num_filas.value, 1), base_datos)
 
        };
    };
    async function atajoIndice() {
        manejoDeFechas()
        await searchDatos(subRutaB((input_indice_grupo.value - 1) * 20, 1), base_datos)
        sum_num_indices.value = Number(input_indice_grupo.value);
        sum_num_filas.value = (input_indice_grupo.value - 1) * 20;

    };
    async function restablecerTabla() {
        sum_num_indices.value = 1;
        sum_num_filas.value = 0;
        vaciadoInputBusqueda();
        await conteoFilas(subRutaA(0), num_filas_db, input_indice_grupo, sum_num_indices, 20);
        await searchDatos(subRutaB(0, 0), base_datos);
    };
    async function filtro() {
        manejoDeFechas()
        sum_num_indices.value = 1;
        sum_num_filas.value = 0;
        await conteoFilas(subRutaA(1), num_filas_db, input_indice_grupo, sum_num_indices, 20);
        await searchDatos(subRutaB(0, 1), base_datos);
    };
    function manejoDeFechas() {
        if (input_fecha_inicio && input_fecha_fin) {
            const fecha = new Date();
            const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día tenga dos dígitos 
            const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Asegura que el mes tenga dos dígitos 
            const anio = fecha.getFullYear();
            inicio.value = input_fecha_inicio.value;
            fin.value = input_fecha_fin.value;
            if (inicio.value === "" && fin.value === "") {
            inicio.value = '2000-01-01';
            fin.value = `${anio}-${mes}-${dia}`;
            } else if (inicio.value === "" && fin.value !== "") {
            inicio.value = '2000-01-01';
            } else if (inicio.value !== "" && fin.value === "") {
            fin.value = `${anio}-${mes}-${dia}`;
            }
        } else {
            return "";
        }
    }
    function vaciadoInputBusqueda(){
        filters.value.filtro_uno = '';
        filters.value.filtro_dos = '';
        filters.value.filtro_tres = '';
        filters.value.filtro_cuatro = '';
        filters.value.filtro_cinco = '';
        input_fecha_inicio.value = '';
        input_fecha_fin.value = '';
    };
    async function recargaTabla(){
        manejoDeFechas();
        await conteoFilas(subRutaA(1), num_filas_db, input_indice_grupo, sum_num_indices, 20);
        await searchDatos(subRutaB(Number(sum_num_filas.value), 1), base_datos);
    }
    watch(() => dbStore.db_clientes, (newVal, oldVal) =>{
        if(oldVal.length > 0){
            recargaTabla()
        }
    }, {deep: true});
    watch(() => dbStore.recarga_tabla, (newVal) =>{
        if(newVal === true){
            recargaTabla()
        }
        dbStore.deshabilitarRecarga('recarga_tabla')
    }, {deep: true});
    onMounted(async () => {
        try {
            await conteoFilas(  subRutaA(0), num_filas_db, input_indice_grupo, sum_num_indices, 20)
            await searchDatos(  subRutaB(Number(input_indice_grupo.value) - 1, 0), base_datos)
        } catch (error) {
            console.error('Error en mounted hook:', error);
        };
    });

</script>

<template>
    <div>
        
        <table id="tabla-clientes" class="tabla-proforma">
            <thead>
                <tr v-if="row_title">
                    <th scope="row" colspan="15">
                        <h1 style="margin: 5px;">
                            {{ row_title }}
                        </h1>
                    </th>
                </tr>
                <tr v-if="row_select">
                    <th scope="row" colspan="15">
                        <select v-model="filters.filtro_cero" id="filtro-tabla-clientes-clase" class="input-select-ventas">
                            <option v-for="option in select" :key="option.value" :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </th>
                </tr>
                <tr v-if="row_button">
                    <th scope="row" colspan="15">
                        <div style="display: grid;
                            gap: 10px;
                            grid-template-columns: 15% 15% 15%;
                            justify-content: center;">
                            <button @click="filtro()" id="buscarFiltrosClientes" class="btnUnoB">Buscar</button>
                            <button @click="restablecerTabla()" id="restablecerClientes" class="btnDosB">Restablecer</button>
                            <button id="reporteClientes" @click="props.clickFunctionReportes" class="btnUnoB">Reporte de ventas</button>
                        </div>
                    </th>
                </tr>
                <tr v-if="row_date">
                    <th scope="row" colspan="15">
                        <div>Fecha Inicio
                            <input v-model="input_fecha_inicio" id="_fecha_inicio_" type="date" class="input-filtro">
                            Fecha Fin
                            <input v-model="input_fecha_fin" id="_fecha_fin_" type="date" class="input-filtro">
                        </div>
                    </th>
                </tr>
                <tr>
                    <th v-for="column in columns" :key="column.key" :style="{ width: column.width, background: column.fondo }">
                        {{ column.label }}
                        <input v-if="column.filterable" v-model="filters[column.element]" type="text" class="input-filtro" :placeholder="column.label">
                    </th>
                    <th style="width: 120px;text-align: center;">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="dato in base_datos" :key="dato[idKey]">
                    <td class="inv">{{ dato[idKey] }}</td>
                    <td v-for="column in columns" :key="column.key" 
                        :style="{ textAlign: column.alineacion, borderLeft: column.label === 'Sucursal' ? '6px solid ' + dbStore.CS(dato.sucursal_nombre) : '' }"
                    >{{ dato[column.key] }}</td>
                    <td style="text-align: center; display: flex;gap: 5px; align-items: center; justify-content: center;">
                        <slot name="actions" :dato="dato"></slot>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row" colspan="16">
                        <button @click="retrocederInicio()" class="btnDosB"><<<</button>
                        <button @click="retroceder()" class="btnDosB"><<  </button>
                        <select @change="atajoIndice()" v-model="input_indice_grupo" style="width: 50px; text-align: center;">
                            <option v-for="fila_num in num_grupos" :key="fila_num" :value="fila_num">{{ fila_num }}</option>
                        </select>
                        <button @click="avanzar()" class="btnDosB">  >></button>
                        <button @click="avanzarFinal()" class="btnDosB">>>></button>
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style scoped>


</style>