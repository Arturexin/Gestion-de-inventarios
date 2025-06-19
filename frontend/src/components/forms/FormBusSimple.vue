<script setup>
    import { useDataBases } from '../../stores/dataBases';
    import { ref } from 'vue';


    const dbStore = useDataBases();

    const input_search = ref('');
    const array_grupo = ref([]);
    const categoria_grupo = ref('0')


    function buscadorGrupoCodigo(){
        array_grupo.value = dbStore.db_productos.filter(producto => producto.codigo.toLowerCase().includes(input_search.value) &&
                                                                    input_search.value !== '' && 
                                                                    ((Number(categoria_grupo.value) === producto.categoria ||
                                                                    categoria_grupo.value === "0")))
    console.log(array_grupo.value)
    }
    function buscadorGrupoDescripcion(){
        array_grupo.value = dbStore.db_productos.filter(producto => producto.descripcion.toLowerCase().includes(input_search.value)&&
                                                                    input_search.value !== '' && 
                                                                    ((Number(categoria_grupo.value) === producto.categoria ||
                                                                    categoria_grupo.value === "0")))
    }
    function limpiarGrupo(){
        array_grupo.value = [];
    }
</script>

<template>
    <div class="contenedor_busqueda_detalle">
        <div style="display: grid; gap: 10px;">
            <h2 style="text-align: center;">Buscador</h2>
            <div style="display: grid;justify-items: center;gap: 10px;">
                <div style="display: flex;">
                    <input type="text" v-model="input_search" id="buscador_descripcion" placeholder="Buscar por palabras clave..." class="input-general-dos fondo-input" style="width: 230px;">
                    <div class="tooltip_ayuda">
                        <span class="material-symbols-outlined">find_in_page</span>
                        <span class="tooltiptext_ayuda">Digite palabras clave para hacer la búsqueda del producto.</span>
                    </div>
                </div>
                <div style="display: flex;">
                    <select style="width: 240px; text-align: center;" v-model="categoria_grupo" class="input-general fondo-input">
                        <option value="0">--Categoría--</option>
                        <option v-for="e in dbStore.db_categorias" :value="e.id">{{ e.categoria_nombre }}</option>
                    </select>
                    <div class="tooltip_ayuda">
                        <span class="material-symbols-outlined">help</span>
                        <span class="tooltiptext_ayuda">Seleccione la categoría en la que se encuentra el producto a buscar.</span>
                    </div>
                </div>
            </div>
            <button @click="buscadorGrupoCodigo()" class="btnUnoB">Buscar por código</button>
            <button @click="buscadorGrupoDescripcion()" class="btnUnoB">Buscar por descripción</button>
            <button @click="limpiarGrupo()" class="btnDosB">Eliminar</button>
        </div>
        <div>
            <ul style="padding: 5px;height: 40px; margin: 5px 0;">
                <li class="diseno_li">
                    <span style="width: 80px; text-align: left;"><h3>Código</h3></span> 
                    <span style="width: 80px; text-align: center;"><h3>Descripción</h3></span> 
                    <span style="width: 80px; text-align: center;"><h3>Usar</h3></span>
                </li>
            </ul>
        </div>
        <div class="contenedor_busqueda_detalle_interior">
            <ul style="padding: 5px 0;">
                <li class="diseno_li" v-for="dato in array_grupo">
                    <span class="inv id_detalle">{{ dato.idProd }}</span> 
                    <span class="inv categoria_detalle">{{dato.categoria}}</span> 
                    <span class="codigo_detalle">{{dato.codigo}}</span> 
                    <span class="descripcion_detalle">{{dato.descripcion}}</span> 
                    <slot name="actions" :dato="dato"></slot>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>

.contenedor_busqueda_detalle{
    display: grid;
    gap: 10px;
    background: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto));
    background-blend-mode: normal;
    width: 285px;
    padding: 7px;
    font-size: 12px;
    /* align-items: center; */
}
.contenedor_busqueda_detalle_interior{
    overflow-y: scroll;
    height: 80vh;
    padding: 10px;
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

.diseno_li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 3px 0;
    padding: 0 0 0 5px;
}
.diseno_li:hover {
	background:var(--fondo-cuarto);
}
.diseno_li:active {
	position:relative;
	top:1px;
	color: var(--color-secundario);
}
</style>