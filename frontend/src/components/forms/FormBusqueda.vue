<script setup>
    import { defineProps, ref, watch } from 'vue';
    import { expReg } from '../../services/expReg.js';
    import { useModalStore } from '../../stores/modalStore.js';
    import { useDataBases } from '../../stores/dataBases.js';
    import { ObjGeneral } from '../../services/objetoGeneral.js';
    import { cargarDatos } from '../../services/functionFetch.js';  


    const dbStore = useDataBases();
    const modalStore = useModalStore();
    //states
    const codigo_busqueda = ref('');
    const mensaje_ = ref(''); // Estado para rastrear el mensaje de la modal
    const campos = ref({
        idForm: { v: '', regex: expReg.cantidad, mensaje: "El ID no es válido.", b_c: ''},
        categoriaForm: { v: '0', regex: expReg.cantidad, mensaje: "La categoría no es válida.", b_c: ''},
        codigoForm: { v: '', regex: expReg.codigo, mensaje: "El código no es válido.", b_c: ''},
        descripcionForm: { v: '', regex: expReg.descripcion, mensaje: "La descripción no es válida.", b_c: ''},
    });
    //Props
    const props = defineProps({
        titulo: {
            type: String,
            required: true,
        },
        clickFuncion: {// pasamos esta prop debido a que se llamará a diferentes componentes
            type: Function,
            required: true
        },
    });
    //methods
    function buscarCodigo(){
        if(codigo_busqueda.value === ''){
            reseteoFormulario()
        };
        let producto = dbStore.busquedaDinamica(codigo_busqueda.value.toLowerCase());
        if(producto){
            reseteoFormulario();
            campos.value.idForm.v = producto.idProd;
            campos.value.categoriaForm.v  = producto.categoria;
            campos.value.codigoForm.v = producto.codigo;
            campos.value.descripcionForm.v = producto.descripcion;

        }else if(producto === undefined){
            reseteoFormulario();
        };
    };
    function reseteoFormulario(){
        for (let campo in campos.value) {
            campos.value[campo].v = campo === 'categoriaForm' ? '0' : '';
            campos.value[campo].b_c = ''; // Restablece el color de fondo
        }
    };

    function generarDato(talla){
        const new_codigo = campos.value.codigoForm.v.replace(/-(.*?)-/, `-${talla}-`);
        const search_id = dbStore.busquedaDinamica(new_codigo)
        if (!search_id) {
            return false;
        }
        if(search_id.codigo === campos.value.codigoForm.v){
            dbStore.r_.cod_ref = search_id;
        }
        return search_id;
    }
    function coincidenciasLC(codigo_search){
        const coincidencia_lc = dbStore.r_.array_recompras.find(x => x.codigo === codigo_search)
        if(coincidencia_lc !== undefined){
            return false; // Detener el proceso
        }
        return true; // Continuar el proceso
        
    } 
    function validarFormulario() {
        const tallas = dbStore.categoriaTallas(campos.value.categoriaForm.v);
        let cod_rep = [];
        let index = 0;
        tallas.forEach((talla, i) => {
            let dato_ = generarDato(talla);
            if(dato_ === false){
                return;
            }
            
            const c_lc = coincidenciasLC(dato_.codigo)//busca coincidencias en lista de recompras
            if(c_lc){
                dbStore.r_.array_init[index] = new ObjGeneral(
                                                                dato_.idProd,
                                                                dato_.categoria,
                                                                dato_.codigo,
                                                                dato_.descripcion,
                                                                '', 0, 0, 0, 0, 0, 0, 0,
                                                                '', '', 0, 0, 0, 0, 0
                                                            );
                index+=1;
            }   
            if(!c_lc){
                cod_rep.push(dato_.codigo);
            } 
        });
        searchId();
        if(cod_rep.length > 0){
            mensaje_.value = `El código "${cod_rep.join(', ')}" ya existe en la lista de recompras.`;
            modalStore.createMsj('showModalMsj', mensaje_.value, 2);
        }
        return modalStore.crearModal('showModalB');
    };
    
    async function searchId() {
        let ids = dbStore.r_.array_init.map(x => x.idProd);
        let response = await cargarDatos(   `almacen_central_codigo_transferencias?`+
                                            `ids=${ids.join(",")}`);
        
        dbStore.r_.array_init.forEach((item, i) => {
            const fila_res = response.find(x => x.idProd === item.idProd);
            if (fila_res) {
                dbStore.r_.array_init[i].descripcion = fila_res.descripcion;
                dbStore.r_.array_init[i].talla = fila_res.talla;
                dbStore.r_.array_init[i].existencias_ac = fila_res.existencias_ac;
                dbStore.r_.array_init[i].existencias_su = fila_res.existencias_su;
                dbStore.r_.array_init[i].existencias_sd = fila_res.existencias_sd;
                dbStore.r_.array_init[i].existencias_st = fila_res.existencias_st;
                dbStore.r_.array_init[i].existencias_sc = fila_res.existencias_sc;
                dbStore.r_.array_init[i].costo = fila_res.costo_unitario;
                dbStore.r_.array_init[i].precio = fila_res.precio_venta;
                dbStore.r_.array_init[i].lote = fila_res.lote;
                dbStore.r_.array_init[i].proveedor = fila_res.proveedor;
                dbStore.r_.array_init[i].name_prov = dbStore.db_proveedores.find(proveedor => proveedor.id_cli === fila_res.proveedor)?.nombre_cli || '';
                dbStore.r_.array_init[i].name_cat = dbStore.db_categorias.find(categoria => categoria.id === fila_res.categoria)?.categoria_nombre || '';
            }
        });
    };
    watch(()=> dbStore.r_.cod_search, (newVal)=>{
        if (!newVal || typeof newVal !== 'object') {
            return; // No hacer nada si el valor es inválido
        }
        codigo_busqueda.value = newVal.codigo; // Elimina espacios en blanco
        buscarCodigo();
    })
</script>

<template>
    <div>
        <form id="formulario-compras-uno" class="into_form">
            
            <h2 style="margin: 10px;">{{ props.titulo }}</h2>
            <div style="display: flex;">
                <input 
                    type="text" 
                    class="input-general-dos fondo-input" 
                    placeholder="Buscar código" 
                    v-model="codigo_busqueda"
                    @input="buscarCodigo()"
                >
            </div>
            <div class="contenedor-label-input-compras">
                <label class="label-general">
                    <div style="width: 140px;">Categoría
                    </div>
                    <select class="input-general fondo-input" style="cursor: pointer;" disabled v-model="campos.categoriaForm.v" >
                        <option value="0">Seleccione una categoría</option>
                        <option v-for="e in dbStore.db_categorias" :value="e.id">{{ e.categoria_nombre }}</option>
                    </select>
                </label>
                <label class="label-general">
                    <div style="width: 140px;">Código
                    </div>
                    <input class="input-general fondo-input" type="text" id="codigo-form" disabled v-model="campos.codigoForm.v"/>
                </label>
                <label class="label-general">
                    <div style="width: 140px;">Descripción
                    </div>
                    <input class="input-general fondo-input" type="text" id="descripcion-form" disabled v-model="campos.descripcionForm.v"/>
                </label>
            </div>
            <div class="contenedor-botones">
                <button class="btnUno" @click.prevent="validarFormulario()">Ingresar</button>
                <button class="btnDos" @click.prevent="reseteoFormulario()">Cancelar</button>
            </div>
    </form>
    </div>
</template>

<style scoped>
.contenedor-botones{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 400px;
}

.into_form{
    display: grid;
    justify-items: center;
    gap: 1em;
    width: 550px;
    padding: 10px 0;
}

</style>