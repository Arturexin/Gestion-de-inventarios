<script setup>
    import { defineProps, ref, onMounted } from 'vue';
    import { expReg } from '../../services/expReg.js';
    import { useDataBases } from '../../stores/dataBases.js';
    import { useModalStore } from '../../stores/modalStore.js';
    import { ObjGeneral } from '../../services/objetoGeneral.js';
    
    const dbStore = useDataBases();
    const modalStore = useModalStore();

    //States
    const objeto_compra = ref({})
    const mensaje_ = ref(''); // Estado para rastrear el mensaje de la modal

    const campos = ref({
        categoriaForm: { v: '0', regex: expReg.cantidad, mensaje: "La categoría no es válida.", b_c: ''},
        codigoForm: { v: '', regex: expReg.codigo, mensaje: "El código no es válido.", b_c: ''},
        descripcionForm: { v: '', regex: expReg.descripcion, mensaje: "La descripción no es válida.", b_c: ''},
        costoForm: { v: '', regex: expReg.precios, mensaje: "El costo no es válido.", b_c: ''},
        precioForm: { v: '', regex: expReg.precios, mensaje: "El precio no es válido.", b_c: ''},
        loteForm: { v: '', regex: expReg.cantidad, mensaje: "El lote no es válido.", b_c: ''},
        proveedorForm: { v: '0', regex: expReg.cantidad, mensaje: "El proveedor no es válido.", b_c: ''},
    });
    //Props
    const props = defineProps({
        titulo: {
            type: String,
            required: true, 
        }
    });
    //methods
    function reseteoFormulario(){
        for (let campo in campos.value) {
            campos.value[campo].v = campo === 'categoriaForm' || campo === 'proveedorForm' ? '0' : '';
            campos.value[campo].b_c = ''; // Restablece el color de fondo
        }
    };

    function inicioObjeto(){
        objeto_compra.value = new ObjGeneral(0, 0, "", "", "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    function llenadoObjeto(talla){
        objeto_compra.value.categoria = campos.value.categoriaForm.v;
        objeto_compra.value.codigo = `${campos.value.codigoForm.v}-${talla}-${campos.value.loteForm.v}`;
        objeto_compra.value.descripcion = campos.value.descripcionForm.v;
        objeto_compra.value.talla = talla;
        objeto_compra.value.costo = Number(campos.value.costoForm.v).toFixed(2);
        objeto_compra.value.precio = Number(campos.value.precioForm.v).toFixed(2);
        objeto_compra.value.lote = campos.value.loteForm.v;
        objeto_compra.value.proveedor = campos.value.proveedorForm.v;
    }
    function exp(e){
        const v = e.v;
        if(!e.regex.test(v)){
            e.b_c = "var(--boton-dos)"
            return false;
        }else{
            e.b_c = "";
            return true
        };
    };
    function talla(){
        const tallas = dbStore.categoriaTallas(campos.value.categoriaForm.v);
        let cod_rep = [[], []];
        tallas.forEach(talla => {
            llenadoObjeto(talla);
            const dato_db = coincidenciasDB(objeto_compra.value.codigo)//busca coincidencias en base de datos
            const dato_lc = coincidenciasLC(objeto_compra.value.codigo)//busca coincidencias en lista de compras
            if(dato_db && dato_lc){
                dbStore.c_.array_init.push({ ...objeto_compra.value }); // Crea una copia del objeto
            }
            if(!dato_db){
                cod_rep[0].push(objeto_compra.value.codigo);
            }
            if(!dato_lc){
                cod_rep[1].push(objeto_compra.value.codigo);
            } 
        });
        return cod_rep;
    };

    
    function coincidenciasDB(codigo_search) {
        const coincidencia_db = dbStore.busquedaDinamica(codigo_search)
        if(coincidencia_db !== undefined){
            return false; // Detener el proceso
        }
        return true; // Continuar el proceso
    }
    function coincidenciasLC(codigo_search){
        const coincidencia_lc = dbStore.c_.array_compras.find(x => x.codigo === codigo_search)
        if(coincidencia_lc !== undefined){
            return false; // Detener el proceso
        }
        return true; // Continuar el proceso
    } 
    function validarFormulario() {
        let errores = [];
        let cod_rep = [];
        
        for(let campo in campos.value){
            const result = exp(campos.value[campo])
            result ? '' : errores.push(campos.value[campo].mensaje);
        }
        // Mostrar errores si existen
        if (errores.length > 0) {
            mensaje_.value = `\n${errores.join('\n')}`;
            modalStore.createMsj('showModalMsj', mensaje_.value, 2);
            return false; // Detener el proceso
        }
        cod_rep = talla()
        if(cod_rep[0].length > 0){
            mensaje_.value = `El código "${cod_rep[0].join(', ')}" ya existe en la base de datos.`;
            modalStore.createMsj('showModalMsj', mensaje_.value, 2);
        }
        if(cod_rep[1].length > 0){
            mensaje_.value = `El código "${cod_rep[0].join(', ')}" ya existe en la base de datos. El código "${cod_rep[1].join(', ')}" ya existe en la lista de compras.`;
            modalStore.createMsj('showModalMsj', mensaje_.value, 2);
        }
        console.log(dbStore.c_.array_init)
        return modalStore.crearModal('showModalA'); // Continuar con el proceso
    };
    
    onMounted(async()=>{
        inicioObjeto();
    });

</script>

<template>
    <div>
        <form class="into_form">
            
            <h2 style="margin: 10px;">{{ props.titulo }}</h2>
            <div>
                <label class="label-general">
                    <div style="width: 140px;">Categoría
                    </div>
                    <select class="input-general fondo-input" 
                        :style="{background: campos.categoriaForm.b_c}" 
                        style="cursor: pointer;"
                        v-model="campos.categoriaForm.v" 
                        @change="exp(campos.categoriaForm)"
                    >
                        <option value="0">Seleccione una categoría</option>
                        <option v-for="event in dbStore.db_categorias" :value="event.id">{{ event.categoria_nombre }}</option>
                    </select>
                </label>
                <label class="label-general">
                    <div style="width: 140px;">Código
                    </div>
                    <input class="input-general fondo-input" type="text" 
                        :style="{background: campos.codigoForm.b_c}"
                        v-model="campos.codigoForm.v" 
                        @input="exp(campos.codigoForm)"
                    />
                </label>
                <label class="label-general">
                    <div style="width: 140px;">Descripción
                    </div>
                    <input class="input-general fondo-input" type="text" 
                        :style="{background: campos.descripcionForm.b_c}"
                        v-model="campos.descripcionForm.v" 
                        @input="exp(campos.descripcionForm)"
                    />
                </label>
                <label class="label-general">
                    <div style="width: 140px;">Costo de compra
                    </div>
                    <input class="input-general fondo-input" type="text" 
                        :style="{background: campos.costoForm.b_c}"
                        v-model="campos.costoForm.v" 
                        @input="exp(campos.costoForm)"
                    />
                </label>
                <label class="label-general">
                    <div style="width: 140px;">Precio de venta
                    </div>
                    <input class="input-general fondo-input" type="text" 
                        :style="{background: campos.precioForm.b_c}"
                        v-model="campos.precioForm.v" 
                        @input="exp(campos.precioForm)"
                    />
                </label>
                <label class="label-general">
                    <div style="width: 140px;">Lote
                    </div>
                    <input class="input-general fondo-input" type="text" 
                        :style="{background: campos.loteForm.b_c}"
                        v-model="campos.loteForm.v" 
                        @input="exp(campos.loteForm)"
                    />
                </label>
                <label class="label-general">
                    <div style="width: 140px;">Proveedor
                    </div>
                    <select class="input-general fondo-input"  
                        :style="{background: campos.proveedorForm.b_c}" 
                        style="cursor: pointer;" 
                        v-model="campos.proveedorForm.v" 
                        @change="exp(campos.proveedorForm)"
                    >
                        <option value="0">Seleccione un proveedor</option>
                        <option v-for="event in dbStore.db_proveedores" :value="event.id_cli">{{ event.nombre_cli }}</option>
                    </select>
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