<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useDataBases } from '../../stores/dataBases';
    import { useModalStore } from '../../stores/modalStore';
    import { ObjGeneral } from '../../services/objetoGeneral';
    import { cargarDatos } from '../../services/functionFetch';

    const dbStore = useDataBases();
    const modalStore = useModalStore();

    //Variables
    const objeto_venta = ref({}); // Estado para rastrear el array de productos

    const codigo_busqueda = ref(''); // Estado para rastrear el código de búsqueda

    const sucursal_ = ref(''); // Estado para rastrear la sucursal de búsqueda

    const existencias_ = ref(0); // Estado para rastrear las existencias de búsqueda
    const medida_ = ref(''); // Estado para rastrear la talla de búsqueda
    const costo_unitario_ = ref(0); // Estado para rastrear el costo unitario de búsqueda
    const precio_venta_ = ref(0); // Estado para rastrear el precio de venta de búsqueda

    const existencias_saldo = ref(0); // Estado para rastrear el saldo de existencias
    const p_v = ref(0); // Estado para rastrear el precio de venta
    const cantidadAVender = ref(0); // Estado para rastrear la cantidad a vender
    const total_venta = ref(0); // Estado para rastrear el total de la venta

    const existencia_reservada = ref(0); // Estado para rastrear las existencias reservadas

    //Methods
    function resetDetalleVentas(){
        existencias_.value = 0;
        medida_.value = '';
        existencias_saldo.value = 0;
        p_v.value = 0;
        cantidadAVender.value = 0;
        total_venta.value = 0;

        existencia_reservada.value = 0;
    };
    function inicioObjeto(){
        objeto_venta.value = new ObjGeneral(0, 0, "", "", "", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    function llenadoObjeto(response){
        objeto_venta.value.idProd = response[0].idProd;
        objeto_venta.value.categoria = response[0].categoria;
        objeto_venta.value.codigo = response[0].codigo;
        objeto_venta.value.descripcion = response[0].descripcion;
        objeto_venta.value.talla = response[0].talla;
        objeto_venta.value.existencias_ac = response[0].existencias_ac;
        objeto_venta.value.existencias_su = response[0].existencias_su;
        objeto_venta.value.existencias_sd = response[0].existencias_sd;
        objeto_venta.value.existencias_st = response[0].existencias_st;
        objeto_venta.value.existencias_sc = response[0].existencias_sc;
        objeto_venta.value.costo = response[0].costo_unitario;
        objeto_venta.value.precio = response[0].precio_venta;
        objeto_venta.value.lote = response[0].lote;
        objeto_venta.value.proveedor = response[0].proveedor;
        objeto_venta.value.q_ac = 0;
        objeto_venta.value.q_su = 0;
        objeto_venta.value.q_sd = 0;
        objeto_venta.value.q_st = 0;
        objeto_venta.value.q_sc = 0;
    }
    function buscarCodigo(){
        if(Number(dbStore.v_.array_venta[0].id_sucursal) === 0 || dbStore.v_.array_venta[0].comprobante === ''){
            modalStore.createMsj('showModalMsj', `Seleccione una sucursal y comprobante de venta.`, 2)
            codigo_busqueda.value = "";
            return;
        }
        if(codigo_busqueda.value === ''){
            inicioObjeto();
            resetDetalleVentas();
        };
        let producto = dbStore.busquedaDinamica(codigo_busqueda.value.toLowerCase());
        if(producto){
            inicioObjeto();
            objeto_venta.value.idProd = producto.idProd;
            objeto_venta.value.categoria  = producto.categoria 
            objeto_venta.value.codigo = producto.codigo
            objeto_venta.value.descripcion = producto.descripcion

            resetDetalleVentas();
        }else if(producto === undefined){
            inicioObjeto();
            resetDetalleVentas();
        };
    };

    async function busquedaProductoPorId(){//Busca productos por id condicionado por su stock
        if(Number(dbStore.v_.array_venta[0].id_sucursal) === 0 || dbStore.v_.array_venta[0].comprobante === ''){
            modalStore.createMsj(   'showModalMsj', 
                                    `Seleccione una sucursal y comprobante de venta.`,
                                    2)
            return;
        }

        let ids = [objeto_venta.value.idProd];
        let response = await cargarDatos(   `almacen_central_codigo_transferencias?`+
                                            `ids=${ids.join(",")}`);

        if(response[0][dbStore.v_.array_venta[0].suc[0]] > 0){
            llenadoObjeto(response)
        }else{
            modalStore.createMsj(   'showModalMsj', 
                                    `Existencias insuficientes. Este producto no se podrá agregar a la lista.`,
                                    2)
        }
        let fila_res = dbStore.v_.array_venta[1].find(x => x.idProd === response[0].idProd)// Busca coincidencias en v_.array_venta
        if(fila_res){//Si no existe coincidencias en v_.array_venta se crea el objeto de venta
            modalStore.createMsj(   'showModalMsj', 
                                    `El producto "${fila_res.codigo}, ${fila_res.descripcion}" ya se encuentra en la lista de venta con ${fila_res[dbStore.v_.array_venta[0].suc[1]]} unidades.`,
                                    2)
            if(response[0][dbStore.v_.array_venta[0].suc[0]] - fila_res[dbStore.v_.array_venta[0].suc[1]] > 0){
                existencia_reservada.value = fila_res[dbStore.v_.array_venta[0].suc[1]];
            }else{
                modalStore.createMsj(   'showModalMsj', 
                                        `Existencias insuficientes. Este producto no se podrá agregar a la lista.`,
                                        2)
            }
        };
    };
    async function ventaRapida(){
        if(codigo_busqueda.value !== "" && 
        objeto_venta.idProd !== ""){
            await busquedaProductoPorId()
            incrementar(0)
            agregarAListaProductos()//agrega nueva fila
        };
    };
    async function ventaDetallada_uno() {
        if(codigo_busqueda.value !== ""){
            /* modal_proceso_abrir("Buscando resultados...", "", "") */
            await busquedaProductoPorId()
            if(objeto_venta.value.idProd !== 0){
                costo_unitario_.value = objeto_venta.value.costo;
                precio_venta_.value = objeto_venta.value.precio;
                
                existencias_.value = objeto_venta.value[dbStore.v_.array_venta[0].suc[0]] - existencia_reservada.value;
                medida_.value = objeto_venta.value.talla;

                existencias_saldo.value = objeto_venta.value[dbStore.v_.array_venta[0].suc[0]] - existencia_reservada.value;
                p_v.value = (objeto_venta.value.precio).toFixed(2);

                cantidadAVender.value = "0";//reinicia la cantidad a comprar
                total_venta.value = "00.00";//reinicia el monto a comprar
            };
        };
    };
    function incrementar(clave){//ventas
        if(clave === 0 && Number(cantidadAVender.value) < Number(existencias_.value) &&
        (Number(cantidadAVender.value) > 0 || !isNaN(Number(cantidadAVender.value)))){
            cantidadAVender.value = Number(cantidadAVender.value) + 1;
            existencias_saldo.value = Number(existencias_saldo.value) - 1;
            total_venta.value = (Number(cantidadAVender.value) * Number(p_v.value)).toFixed(2);
        }
        if(clave === 1 && (Number(p_v.value) > 0 || !isNaN(Number(p_v.value)))){
            p_v.value = (Number(p_v.value) + 1).toFixed(2);
            total_venta.value = (Number(cantidadAVender.value) * Number(p_v.value)).toFixed(2);
        }
    };
    function decrementar(clave){//ventas
        if(clave === 0 && Number(cantidadAVender.value) > 0 &&
        (Number(cantidadAVender.value) > 0 || !isNaN(Number(cantidadAVender.value)))){
            cantidadAVender.value = Number(cantidadAVender.value) - 1;
            existencias_saldo.value = Number(existencias_saldo.value) + 1;
            total_venta.value = (Number(cantidadAVender.value) * Number(p_v.value)).toFixed(2);
        };
        if(clave === 1 && Number(p_v.value) > 0 && (Number(p_v.value) > 0 || !isNaN(Number(p_v.value)))){
            p_v.value = (Number(p_v.value) - 1).toFixed(2);
            total_venta.value = (Number(cantidadAVender.value) * Number(p_v.value)).toFixed(2);
        }
    };
    function cantidadKey(){//ventas
        if(Number(cantidadAVender.value) < Number(existencias_.value) && 
        Number(cantidadAVender.value) > 0 || !isNaN(Number(cantidadAVender.value))){
            existencias_saldo.value = Number(existencias_.value) - Number(cantidadAVender.value);
            total_venta.value = (Number(cantidadAVender.value) * Number(p_v.value)).toFixed(2);
        };
    };
    function agregarAListaProductos(){// Busca coincidencias el tabla lista de productos y agrega nuevas filas
        if((Number(cantidadAVender.value) > 0 && Number(p_v.value) > 0) &&
        (!isNaN(Number(cantidadAVender.value)) && !isNaN(Number(p_v.value)))){
            let array_ = dbStore.v_.array_venta[1].find(x=> x.idProd === objeto_venta.value.idProd)//buscamos una coincidencia en v_.array_venta
            objeto_venta.value[dbStore.v_.array_venta[0].suc[1]] = Number(cantidadAVender.value) + existencia_reservada.value;
            objeto_venta.value.precio = Number(p_v.value);
            if(array_){
                Object.assign(array_, objeto_venta.value); // Actualiza el objeto existente en v_.array_venta
            }else{
                dbStore.v_.array_venta[1].push(objeto_venta.value);
            }
            inicioObjeto();
            resetDetalleVentas();
            codigo_busqueda.value = "";
        }else{
            modalStore.createMsj(   'showModalMsj', 
                                    `Cantidad a vender o precio de venta no puede ser 0.`,
                                    2)
        }
    };
    function cambioSelect(){
        inicioObjeto();
        resetDetalleVentas();
        sucursal_.value = dbStore.db_sucursales.find(e => e.id_sucursales === dbStore.v_.array_venta[0].id_sucursal).sucursal_nombre;
        dbStore.v_.array_venta[1] = [];
        dbStore.v_.array_venta[0].suc =   [
                            dbStore._sucursales_nombre.find(e => e.name === sucursal_.value).stock,
                            dbStore._sucursales_nombre.find(e => e.name === sucursal_.value).operacion
                        ];
        codigo_busqueda.value = "";               
    };
    onMounted(async()=>{
        inicioObjeto();
    });

    watch(()=> dbStore.v_.cod_ventas, (newVal)=>{
        if (!newVal || typeof newVal !== 'string') {
            return; // No hacer nada si el valor es inválido
        }
        if(dbStore.v_.array_venta[0].comprobante === '' || 
        dbStore.v_.array_venta[0].id_sucursal === '0'){
            modalStore.createMsj('showModalMsj', `Seleccione una sucursal y comprobante de venta.`, 2)
            dbStore.v_.cod_ventas = '';
            return;
        }
        codigo_busqueda.value = newVal.trim(); // Elimina espacios en blanco
        buscarCodigo();
    })
</script>
    
<template>
    <div class="contenedor_formulario_ventas">
        <div class="uno_form">
            <h2 style="text-align: center;">Venta de Productos</h2>
        </div>
        
        <div class="dos_form" style="display: flex;gap: 60px;">
            <div>
                <select class="dos_form input-select-ventas fondo-input"  v-model="dbStore.v_.array_venta[0].comprobante">
                    <option value="">-- Comprobante --</option>
                    <option value="nota_venta">Nota de Venta</option>
                    <option value="boleta_venta">Boleta de Venta</option>
                    <option value="factura">Factura</option>
                    <option value="proforma">Proforma</option>
                </select>
                <div class="tooltip_ayuda">
                    <span class="material-symbols-outlined">help</span>
                    <span class="tooltiptext_ayuda">Seleccione el tipo de comprobante de venta.</span>
                </div>
            </div>
            <div>
                <select class="input-select-ventas fondo-input" v-model="dbStore.v_.array_venta[0].id_sucursal" @change="cambioSelect">
                    <option value="0">-- Sucursal --</option>
                    <option v-for="e in dbStore.db_sucursales" :value="e.id_sucursales">{{ e.sucursal_nombre }}</option>
                </select>
                <div class="tooltip_ayuda">
                    <span class="material-symbols-outlined">help</span>
                    <span class="tooltiptext_ayuda">Seleccione una sucursal de venta.</span>
                </div>
            </div>
        </div>
        <div class="contenedor_detalle_venta">
            <form class="form_ventas" @keyup.enter="ventaRapida">
                <div style="display: flex;align-items: center;border: 2px solid;">
                    <input class="input_text_ventas" 
                        v-model="codigo_busqueda" 
                        style="font-size: 18px;" 
                        type="text" 
                        placeholder="Buscar por código" 
                        @input="buscarCodigo"
                    >
                    <div class="tooltip_ayuda">
                        <button class="material-symbols-outlined btnUno" @click.prevent="ventaDetallada_uno">Buscar</button>
                        <span class="tooltiptext_ayuda">Busca el código para editar la cantidad y precio de venta.</span>
                    </div>
                </div>
                <label class="label-ventas"><span class="name_">Sucursal</span>
                    <input class="input_text_ventas_disabled " type="text" id="sucursal-ventas" :value="sucursal_" disabled>
                </label>
                <label class="label-ventas"><span class="name_">Categoría</span>
                    <select :value="objeto_venta.categoria" class="input_text_ventas_disabled" disabled>
                        <option value="0">--Categoría--</option>
                        <option v-for="e in dbStore.db_categorias" :value="e.id">{{ e.categoria_nombre }}</option>
                    </select>
                </label>
                <label class="label-ventas"><span class="name_">Código</span>
                    <input :value="objeto_venta.codigo" class="input_text_ventas_disabled " type="text" disabled>
                </label>
                <label class="label-ventas"><span class="name_">Descripción</span>
                    <input :value="objeto_venta.descripcion" class="input_text_ventas_disabled " type="text" disabled>
                </label>
                <label class="label-ventas"><span class="name_">Existencias</span>
                    <input :value="existencias_" class="input_number_ventas_disabled " type="text" disabled>
                </label>
                <label class="label-ventas"><span class="name_">Medidas</span>
                    <input :value="medida_" class="input_number_ventas_disabled " type="text" disabled>
                </label>
                <input type="hidden" id="costo-unitario-ventas" disabled>
                <input type="hidden" id="id-ventas" disabled>
                <input type="hidden" id="precio-ventas-formulario" disabled>
            </form>
            
            <div class="det_ventas">
                <label class="label-ventas"><span class="name_">Cantidad</span>
                    <div class="contenedor_mas_menos">
                        <p class="button_mas_menos" @click="decrementar(0)">-</p>
                        <input 
                            class="input_mas_menos input-ventas-ingresar" v-model="cantidadAVender" type="text"
                            @input="cantidadKey"
                            :style="{ color: Number(cantidadAVender) < 0 || isNaN(Number(cantidadAVender)) ? 'var(--boton-dos)' : 'var(--boton-tres)' }"
                        >
                        <p class="button_mas_menos" @click="incrementar(0)">+</p>
                    </div>
                </label>
                <label class="label-ventas"><span class="name_">Saldo</span>
                <input class="input_number_ventas_disabled" type="text" :value="existencias_saldo" disabled
                    style="color: #eee;"
                    :style="{ background: Number(existencias_saldo) < 0 || isNaN(Number(existencias_saldo)) ? 'var(--boton-dos)' : '' }"
                >
                </label>
                <label class="label-ventas"><span class="name_">Precio</span>
                    <div class="contenedor_mas_menos">
                        <p class="button_mas_menos"  @click="decrementar(1)">-</p>
                        <input 
                            class="input_mas_menos input-ventas-ingresar"  type="text" v-model="p_v"
                            :style="{ color: Number(p_v) < 0 || isNaN(Number(p_v)) ? 'var(--boton-dos)' : 'var(--boton-tres)' }"
                        >
                        <p class="button_mas_menos" @click="incrementar(1)">+</p>
                    </div>
                </label>
                <label class="label-ventas">
                    <span class="name_">Importe</span> 
                    <span class="moneda_ventas"></span>
                    <input class="input_number_ventas_disabled" type="any" :value="total_venta" disabled
                        style="color: #eee;"
                        :style="{ background: Number(total_venta) < 0 || isNaN(Number(total_venta)) ? 'var(--boton-dos)' : '' }">
                </label>
                <button class="btnUno" @click="agregarAListaProductos">Agregar a Lista</button>
                <input id="restablecerFormVentas" type="reset" class="btnDos">
            </div>

        </div>
    </div>

</template>

<style scoped>
.contenedor_formulario_ventas{
    display: grid;
    justify-content: center;
    justify-items: center;
    align-items: center;
    gap: 30px;
    background: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto));
    background-blend-mode: normal;
    width: 750px;
    padding: 20px;
}
.contenedor_detalle_venta{
    display: flex;
    gap: 50px;
}
.form_ventas{
    display: grid;
    gap: 10px;
    width: 400px;
}
.det_ventas{
    display: grid;
    gap: 10px;
    width: 270px;
}
.label-ventas{
    display: flex;
    align-items: center;
}
.name_{
    width: 80px;
    text-align: left;
    margin-right: 10px;
}
.input_text_ventas{
    width: 300px;
    padding: 5px;
    border: 1px solid var(--border-principal);
    background: var(--fondo-quinto);
}
.input_text_ventas_disabled{
    width: 300px;
    padding: 5px;
    border: 1px solid var(--border-principal);
    background: var(--fondo-primero);
}
.input_number_ventas{
    width: 100px;
    padding: 5px;
    border: 1px solid var(--border-principal);
    background: var(--fondo-quinto);
    text-align: right;
}
.input_number_ventas_disabled{
    width: 100px;
    padding: 5px;
    border: 1px solid var(--border-principal);
    background: var(--fondo-primero);
    text-align: right;
}


.button_mas_menos{
    width: 25px;
    height: 25px;
    color: var(--color-principal);
    background: var(--boton-dos);
    cursor: pointer;
    text-decoration:none;
	border: none;
	user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
.button_mas_menos:active {
	position:relative;
	top:1px;
	color: var(--color-principal);
}
.contenedor_mas_menos{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--boton-dos);
    height: 25px;
}
.input_mas_menos{
    width: 120px;
    height: 25px;
    margin: 0px;
    border: none;
    background: none;
    color: var(--color-principal);
    text-align: center;
    outline: none;
}
</style>