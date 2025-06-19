<script setup>
    import { useDataBases } from '../../stores/dataBases';
    import { cargarDatos } from '../../services/functionFetch';
    import { useModalStore } from '../../stores/modalStore';
    import { ref } from 'vue';


    const dbStore = useDataBases();
    const modalStore = useModalStore();

    const input_search = ref('');
    const array_grupo = ref([]);
    const id_categoria = ref('0')
    const anio_ = ref(2025)
    const temporalidad = ref(0)
    const b_c = ref([
        'var(--suc-uno)',
        'var(--suc-dos)',
        'var(--suc-tres)',
        'var(--suc-cuatro)',
        'var(--suc-cinco)'
    ])
    const cabecera_ = ref([])
    const max_und_v = ref(0)
    const mensaje_ = ref('')
    const div_t = [{id:0, name:'Anual'}, {id:1, name:'1° trim'}, {id:2, name:'2° trim'}, {id:3, name:'3° trim'}, {id:4, name:'4° trim'}]


    function buscadorGrupoCodigo(){
        reiniciarButton();
        array_grupo.value = dbStore.db_productos.filter(producto => producto.codigo.toLowerCase().includes(input_search.value) &&
                                                                    input_search.value !== '' && 
                                                                    ((Number(id_categoria.value) === producto.categoria ||
                                                                    id_categoria.value === "0")))

        cabecera_.value = cabeceraSimple(0)
    }
    function buscadorGrupoDescripcion(){
        reiniciarButton();
        array_grupo.value = dbStore.db_productos.filter(producto => producto.descripcion.toLowerCase().includes(input_search.value)&&
                                                                    input_search.value !== '' && 
                                                                    ((Number(id_categoria.value) === producto.categoria ||
                                                                    id_categoria.value === "0")))
        cabecera_.value = cabeceraSimple(0)
    }
    function cabeceraSimple(num){
        if(num === 0){
            return [
                { name: 'Código', w_: '110px' },
                { name: 'Descripción', w_: '300px' },
                { name: 'Usar', w_: '110px' },
            ]
        }else if(num === 1){
            return [
                { name: 'Código', w_: '110px' },
                { name: 'Descripción', w_: '300px' },
                { name: 'Unds. vendidas', w_: '80px' },
                { name: 'Monto de venta', w_: '80px' },
                { name: 'Margen (%)', w_: '80px' },
                { name: 'Stock de inv.', w_: '80px' },
                { name: 'Usar', w_: '80px' },
            ]
        }
    }
    function limpiarGrupo(){
        reiniciarButton();
        array_grupo.value = [];
        cabecera_.value = [];
    }


    async function cargarTop(sucursal_id, index){
        array_grupo.value = await cargarDatos(`salidas_top_ventas?`+
                                        `year_actual=${anio_.value}&`+
                                        `sucursal_venta=${sucursal_id}&`+
                                        `categoria_venta=${id_categoria.value}&`+
                                        `trimestre=${temporalidad.value}&`+
                                        `sucursal_get=${dbStore._sucursales_nombre[index].stock}`)

        if(array_grupo.value.length > 0){
            max_und_v.value = array_grupo.value[0].cantidad_venta
            cabecera_.value = cabeceraSimple(1)

        }else{
            mensaje_.value = `Los datos con temporalidad "${div_t[Number(temporalidad.value)].name}" no existen.`;
            cabecera_.value = [{name:`Los datos con temporalidad "${div_t[Number(temporalidad.value)].name}" no existen.`}]
        };
    };
    async function busquedaStock(index){
        array_grupo.value = [];
        reiniciarButton();
        const sucursal_ = dbStore.db_sucursales.find(x=> x.sucursal_nombre === dbStore._sucursales_nombre[index].name);
        if(sucursal_){
            mensaje_.value = `Datos con temporalidad "${div_t[Number(temporalidad.value)].name}" de "${sucursal_.sucursal_nombre}" encontrados.`;
            await cargarTop(sucursal_.id_sucursales, index)
            b_c.value[index] = dbStore._sucursales_nombre[index].color_b
        }else{
            mensaje_.value = `Los datos de esta sucursal no están habilitados.`;
            cabecera_.value = [{name:`Los datos de esta sucursal no están habilitados.`}]
        };
        modalStore.createMsj('showModalMsj', mensaje_.value, 2);
    };
    function reiniciarButton(){
        for(let i = 0; i < b_c.value.length; i++){
            b_c.value[i] = dbStore._sucursales_nombre[i].color_a
        };
    };
    function cantidad(dato){
        if (Number(dato) <= 0) {
            return dbStore.mapa_calor[4];
        }else if(Number(dato) <= 5){
            return dbStore.mapa_calor[3];
        }else if(Number(dato) <= 10){
            return dbStore.mapa_calor[2];
        }else if(Number(dato) <= 20){
            return dbStore.mapa_calor[1];
        }else{
            return dbStore.mapa_calor[0];
        };
    };
    function puesto(dato, maximo_){
        if (Number(dato) <= maximo_ * 0.20) {
            return dbStore.mapa_calor[4];
        }else if(Number(dato) <= maximo_ * 0.40){
            return dbStore.mapa_calor[3];
        }else if(Number(dato) <= maximo_ * 0.60){
            return dbStore.mapa_calor[2];
        }else if(Number(dato) <= maximo_ * 0.80){
            return dbStore.mapa_calor[1];
        }else if(Number(dato) <= maximo_ * 1){
            return dbStore.mapa_calor[0];
        };
    };

</script>


<template>
    <div>
        <div class="contenedor-busqueda-detalle">
            <div class="contenedor-opciones">
                <h2 style="margin: 10px;text-align: center;">Buscador</h2>
                <div style="display: grid;grid-template-columns: 1fr 1fr;align-items: center;">

                    <div style="display: grid;grid-template-columns: 1fr;gap: 5px;">
                        <input type="text" placeholder="Buscar por palabras clave..." class="input-general-dos fondo-input" v-model="input_search">
                        <div class="cont-into">

                            <select style="width: 120px; text-align: center;" v-model="id_categoria" class="input-general fondo-input">
                                <option value="0">--Categoría--</option>
                                <option v-for="e in dbStore.db_categorias" :value="e.id">{{ e.categoria_nombre }}</option>
                            </select>
                            <select class="select_input fondo-input" v-model="temporalidad" style="width: 120px; text-align: center;">
                                <option v-for="e in div_t" :value="e.id">{{ e.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="btn-acciones">
                        <button class="btnUnoB" @click="busquedaStock(0)" :style="{background: b_c[0]}" style="width: 50px;">Stock AC</button>
                        <button class="btnUnoB" @click="busquedaStock(1)" :style="{background: b_c[1]}" style="width: 50px;">Stock S1</button>
                        <button class="btnUnoB" @click="busquedaStock(2)" :style="{background: b_c[2]}" style="width: 50px;">Stock S2</button>
                        <button class="btnUnoB" @click="busquedaStock(3)" :style="{background: b_c[3]}" style="width: 50px;">Stock S3</button>
                        <button class="btnUnoB" @click="busquedaStock(4)" :style="{background: b_c[4]}" style="width: 50px;">Stock S4</button>
                    </div>
                </div>
                <div class="btn-acciones-dos">
                    <button class="btnUnoB" @click="buscadorGrupoCodigo()">Buscar código</button>
                    <button class="btnUnoB" @click="buscadorGrupoDescripcion()">Buscar descirpción</button>
                    <button class="btnDosB" @click="limpiarGrupo()">Eliminar</button>
                    <button class="btnCuatroB">Imprimir</button>
                </div>
            </div>

            <div class="cuadro-respuesta">
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th v-for="e in cabecera_"
                                    :style="{width: e.w_}" 
                                    style="text-align: center;"
                                >
                                    {{ e.name }}
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="contenedor_busqueda_detalle_interior">
                    <table>
                        <tbody>
                            <tr class="diseno_li" v-for="dato in array_grupo">
                                <td style="width: 100px;">{{dato.codigo}}</td>
                                <td style="min-width: 100px;">{{dato.descripcion}}</td>
                                <td  style="width: 80px; text-align: center;" v-if="dato.cantidad_venta">
                                    <div :style="{background: puesto(dato.cantidad_venta, max_und_v)}">{{dato.cantidad_venta}}</div>
                                </td>
                                <td style="width: 80px; text-align: center;" v-if="dato.cantidad_venta">{{dato.suma_ventas.toFixed(2)}}</td>
                                <td style="width: 80px; text-align: center;" v-if="dato.cantidad_venta">{{((1 - (dato.suma_costos/dato.suma_ventas))*100).toFixed(2)}}%</td>
                                <td style="width: 80px; text-align: center;" v-if="dato.cantidad_venta">
                                    <div :style="{background: cantidad(dato.sucursal_get)}">{{dato.sucursal_get}} uds.</div>
                                </td>
                                <td style="text-align: center;">
                                    <slot name="actions" :dato="dato"></slot>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cuadro-respuesta{
    margin: 0 10px;
    width: 530px;
    border: 2px solid var(--fondo-segundo);
    height: 320px;
    font-size: 12px;
}
.btn-acciones{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
    margin: 5px;
}
.btn-acciones-dos{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    gap: 5px;
    margin: 5px;
}
.contenedor-busqueda-detalle{
    width: 550px;
}
.contenedor-opciones{
    display: grid;
    padding: 10px;
}

.cont-into{
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    gap: 5px;
}

.diseno_li:hover {
	background:var(--fondo-cuarto);
}
.diseno_li:active {
	position:relative;
	top:1px;
	color: var(--color-secundario);
}
.contenedor_busqueda_detalle_interior{
    overflow-y: scroll;
    height: 270px;
    padding: 0 10px;
}
.contenedor_busqueda_detalle_interior::-webkit-scrollbar {
    width: 8px; /* Ancho de la barra de desplazamiento */
}

.contenedor_busqueda_detalle_interior::-webkit-scrollbar-thumb {
    background-color: var(--boton-dos); /* Color de la barra */
}
.contenedor_busqueda_detalle_interior::-webkit-scrollbar-track {
    background-color: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto)); /* Color del fondo de la barra */
}
</style>