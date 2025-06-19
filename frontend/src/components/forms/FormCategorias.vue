<script setup>
    import { ref } from 'vue';
    import { useDataBases } from '../../stores/dataBases';
    import { useModalStore } from '../../stores/modalStore';
    import { enviarDatos } from '../../services/functionFetch';


    const dbStore = useDataBases();
    const modalStore = useModalStore();

    const id_categoria = ref(0);
    const name_categoria = ref("");
    const actividad = ref("0");
    const cantidad_item = ref(0);
    const medidas = ref([]);
    const mensaje_ = ref("");
    const num = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'];

    function incrementar(){
        if (Number(cantidad_item.value) < 12) {
            cantidad_item.value = Number(cantidad_item.value) + 1;
            medidas.value.push({ id: cantidad_item.value, medida: "" });
        }
    };
    function decrementar(){
        if (Number(cantidad_item.value) > 0) {
            cantidad_item.value = Number(cantidad_item.value) - 1;
            medidas.value.pop();
        }
    };
    function edit(dato){
        reiniciar()
        id_categoria.value = dato.id;
        name_categoria.value = dato.categoria_nombre;
        actividad.value = dato.unidad_medida;
        cantidad_item.value = dato.cantidad_item;
        for (let i = 0; i < dato.cantidad_item; i++) {
            medidas.value.push({ id: i + 1, medida: dato[num[i]] });
        }
    }
    function reiniciar(){
        id_categoria.value = 0;
        name_categoria.value = "";
        actividad.value = "0";
        cantidad_item.value = 0;
        medidas.value = [];
    };
    function detalle(dato){
        mensaje_.value = `  Categoría: "${dato.categoria_nombre}" |
                            Actividad: "${dato.unidad_medida}" |
                            N° medidas: "${dato.cantidad_item}" |
                            Medidas: "  ${dato.uno} ${dato.dos} ${dato.tres} ${dato.cuatro} 
                                        ${dato.cinco} ${dato.seis} ${dato.siete} ${dato.ocho} 
                                        ${dato.nueve} ${dato.diez} ${dato.once} ${dato.doce}"`;
        modalStore.createMsj('showModalMsj', mensaje_.value, 2);
    }
    async function saveCategoria() {
        if(name_categoria.value !== "" && actividad.value !== "0" &&
        Number(cantidad_item.value) !== 0 && Number(cantidad_item.value) > 0){
            let obj_data = {
                "categoria_nombre": name_categoria.value,
                "unidad_medida": actividad.value,
                "cantidad_item": Number(cantidad_item.value),
            };
            num.forEach((e, i) => {
                obj_data[e] = medidas.value[i]?.medida || ""; // Usa el operador opcional para evitar errores
            });
            let id = id_categoria.value;
            if (id !== 0) {
                obj_data.id = id
            };
            let ruta = 'categorias'
            let response = await enviarDatos(ruta, obj_data);
            if(response.status === 'success'){
                await dbStore.crearDataBase('db_categorias', 'categorias_db')
                reiniciar();
            }; 
            mensaje_.value = `${response.message}`;
        }else if(name_categoria.value === ""){
            mensaje_.value = `Digite un nombre para la categoría.`;
        }else if(actividad.value === "0"){
            mensaje_.value = `Seleccione una actividad.`;
        }else if(Number(cantidad_item.value) === 0 ||
        Number(cantidad_item.value) <= 0){
            mensaje_.value = `El número de unidades de medidas debe ser mayor a cero.`;
        };
        modalStore.createMsj('showModalMsj', mensaje_.value, 2);
    };
    async function removeCategorias(dato) {
            let ruta = 'categorias_remove'
            let obj_data = {
                'id': dato.id,
            };
            let response = await enviarDatos(ruta, obj_data);
            if(response.status === "success"){
                await dbStore.crearDataBase('db_categorias', 'categorias_db')
            };
            mensaje_.value = `${response.message}`;
            modalStore.createMsj('showModalMsj', mensaje_.value, 2);
        
    };
</script>

<template>
    <div>
        <form class="into_form">
            <h2>Generar Categorías
                <div class="tooltip_ayuda">
                    <span class="material-symbols-outlined">help</span>
                    <span class="tooltiptext_ayuda">Registra nuevas categorías y también edita las existentes.</span>
                </div>
            </h2>
            <div style="display: flex; gap: 5px;">
                <button id="exportar_formato" >Descargar CSV</button>
                <input type="file" id="carga_archivo" accept=".csv" style="width: 320px; cursor: pointer; border: 2px solid cadetblue; margin: 0px;">
                <button id="volcar_datos" >Volcar</button>

            </div>
            <div>
                <div style="display: flex; gap: 10px;justify-content: center;align-items: center;">
                    <div>
                        <div style="display: flex">Nombre de Categoria*
                            <div class="tooltip_ayuda">
                                <span class="material-symbols-outlined">help</span>
                                <span class="tooltiptext_ayuda">El nombre de la categoría puede contener como caracteres letras y números y no debe ser igual a una ya existente.</span>
                            </div>
                        </div>
                        <input class="input-general fondo" 
                            type="text" placeholder="Nombre de la categoría" 
                            v-model="name_categoria">
                    </div>
                    <div>
                        <div style="display: flex">Actividad*
                            <div class="tooltip_ayuda">
                                <span class="material-symbols-outlined">help</span>
                                <span class="tooltiptext_ayuda">Seleccionar el tipo de actividad al que pertenece esta categoría.</span>
                            </div>
                        </div>
                        <select class="input-general fondo" style="cursor: pointer; width: 150px;" v-model="actividad">
                            <option value="0">Selecciona una actividad</option>
                            <option value="Comercio">Comercio</option>
                            <option value="Servicio">Servicio</option>
                            <option value="Alquiler">Alquiler</option>
                        </select>
                    </div>
                    <div>
                        <div style="display: flex">N° medidas* 
                            <div class="tooltip_ayuda">
                                <span class="material-symbols-outlined">help</span>
                                <span class="tooltiptext_ayuda">Esta categoría debe contener como mínimo una medida.</span>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; width:120px" class="contenedor_mas_menos">
                                <p class="resta_cantidad button_mas_menos" @click="decrementar()">-</p>
                                <input id="cantidad_categoria" class="input_mas_menos" type="text" v-model="cantidad_item" disabled>
                                <p class="suma_cantidad button_mas_menos" @click="incrementar()">+</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 5px; margin: 5px 0;justify-content: center;" v-if="medidas.length > 0">
                    <input v-for="e in medidas" :placeholder="'Medida ' + e.id" type="text" style="width: 65px; text-align: center;font-size: 12px;" v-model="e.medida" class="input-general fondo" :key="e.id">
                </div>
            </div>
            <div style="display: flex;gap: 10px; margin: 5px;">
                <button @click.prevent="saveCategoria()" class="btnUnoB" style="width: 150px;">Registrar</button>
                <button @click.prevent="reiniciar()" class="btnDosB" style="width: 150px;">Restablecer</button>
            </div>
        </form>
        <div class="cuadro-respuesta">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 140px;">Categoría</th>
                            <th style="width: 140px;">Actividad</th>
                            <th style="width: 90px;">uds.</th>
                            <th style="width: 130px;">Acciones</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="contenedor_scroll">
                <table>
                    <tbody>
                        <tr class="diseno_li" v-for="(e, i) in dbStore.db_categorias" :key="i">
                            <td style="width: 140px;">{{ e.categoria_nombre }}</td>
                            <td style="width: 140px;">{{ e.unidad_medida }}</td>
                            <td style="width: 90px;text-align: center;">{{ e.cantidad_item }}</td>
                            <td style="display: flex;justify-content: space-around;">
                                <div class="tooltip">
                                    <button class="btnUnoB" @click.prevent="detalle(e)">
                                        <span style="font-size:18px;" class="material-symbols-outlined">list_alt</span>
                                        <span class="tooltiptext">Detalle categoría</span>
                                    </button>
                                </div>
                                <div class="tooltip">
                                    <button class="btnUnoB" @click.prevent="edit(e)">
                                        <span style="font-size:18px;" class="material-symbols-outlined">edit</span>
                                        <span class="tooltiptext">Editar categoría</span>
                                    </button>
                                </div>
                                <div class="tooltip">
                                    <button class="btnDosB" @click.prevent="removeCategorias(e)">
                                        <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                                        <span class="tooltiptext">Eliminar categoría</span>
                                    </button>
                                </div>
                                
                                
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.into_form {
    display: grid;
    justify-items: center;
    gap: 5px;
    width: 550px;
}
.contenedor_mas_menos {
    display: flex
;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--boton-dos);
    height: 25px;
}
.input_mas_menos {
    width: 60px;
    height: 25px;
    margin: 0px;
    border: none;
    background: none;
    color: var(--color-principal);
    text-align: center;
    outline: none;
}
.button_mas_menos {
    width: 25px;
    height: 25px;
    color: var(--color-principal);
    background: var(--boton-dos);
    cursor: pointer;
    text-decoration: none;
    border: none;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
.tabla_ {
    width: 550px;
    margin: 0px auto;
    background: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto));
    font-size: 15px;
}
.contenedor_scroll{
    overflow-y: scroll;
    height: 190px;
    padding: 0 10px;
}
.contenedor_scroll::-webkit-scrollbar {
    width: 8px; /* Ancho de la barra de desplazamiento */
}

.contenedor_scroll::-webkit-scrollbar-thumb {
    background-color: var(--boton-dos); /* Color de la barra */
}
.contenedor_scroll::-webkit-scrollbar-track {
    background-color: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto)); /* Color del fondo de la barra */
}
.elemento_estatico{
    position: sticky;
    top: 0px;
}
.cuadro-respuesta{
    margin: 0 10px;
    width: 530px;
    border: 2px solid var(--fondo-segundo);
    height: 220px;
    font-size: 12px;
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