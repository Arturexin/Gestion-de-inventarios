<script setup>
    import { ref } from 'vue';
    import TabMapaCalor from '../../components/tables/TabMapaCalor.vue';
    import DialMoMensajes from '../../components/modal/DialMoMensajes.vue';
    import { useDataBases } from '../../stores/dataBases';
    import { useModalStore } from '../../stores/modalStore';
    import { cargarDatos } from '../../services/functionFetch';

    //states
    const data_analisis = ref([])
    const anio_ = ref(2025)
    const mensaje_ = ref('')
    const titulo_sucursal = ref('')
    const titulo_categoria = ref('')
    const titulo_producto= ref('')
    const ticket_promedio = ref([])
    const mayor_ticket = ref(0)
    const selectedSucursal = ref(null); // Estado para rastrear el botón seleccionado


    const dbStore = useDataBases()
    const modalStore = useModalStore();


    class Objeto_analisis {
        constructor(categoria, nombre, sucursal) {
            this.categoria = categoria;
            this.nombre = nombre;
            this.sucursal = sucursal;
            this.suma_costos = Array(12).fill(0);
            this.suma_unidades = Array(12).fill(0);
            this.suma_veces = Array(12).fill(0);
            this.suma_ventas = Array(12).fill(0);
            this.suma_ganancias = Array(12).fill(0);
            this.suma_unidades_dev = Array(12).fill(0);
        }

        agregarDatos(mes, costos, unidades, veces, ventas, unidades_dev) {
            this.suma_costos[mes - 1] += costos;
            this.suma_unidades[mes - 1] += unidades;
            this.suma_veces[mes - 1] += veces;
            this.suma_ventas[mes - 1] += ventas;
            this.suma_ganancias[mes - 1] += (ventas - costos);
            this.suma_unidades_dev[mes - 1] += unidades_dev;
        }
    }

    function crearArrayDatos(array_general, parametro){
        let objeto_ = {};
        array_general.forEach(item => {
            if (!objeto_[item[parametro]]) {
                objeto_[item[parametro]] = new Objeto_analisis(item.categoria, item.nombre, item.sucursal, item.codigo);
            }
            objeto_[item[parametro]].agregarDatos(item.mes, item.suma_costos, item.suma_unidades, item.suma_veces, item.suma_ventas, item.suma_unidades_dev);
        });
        return Object.values(objeto_);
    }

    async function dataSucursal(name, num){
        modalStore.numerarEstadoModal('objeto_analisis_sucursal', 0)//reiniciamos la tabla
        modalStore.numerarEstadoModal('objeto_analisis_categoria', 0)//reiniciamos la tabla
        modalStore.numerarEstadoModal('objeto_analisis_producto', 0)//reiniciamos la tabla
        const suc = dbStore.db_sucursales.find(x => x.sucursal_nombre === name)
        if(suc) {
            const response = await cargarDatos( `salidas_categorias_sucursal?`+
                                                `sucursal_salidas=${suc.id_sucursales}&`+
                                                `year_actual=${anio_.value}`)
            if(response.status === "success") {
                data_analisis.value = crearArrayDatos(response.datos, "nombre")
                titulo_sucursal.value = `Análisis de ${suc.sucursal_nombre}.`
                mensaje_.value = `Datos de la sucursal "${suc.sucursal_nombre}" encontrados.`
                modalStore.numerarEstadoModal('objeto_analisis_sucursal', num)
                ticket_promedio.value = ticketPromedio(data_analisis.value)
            }else{
                mensaje_.value = `Datos de ${suc.sucursal_nombre} inexistentes.`
            }
        }else{
            mensaje_.value = `La sucursal ${name} no existe, o no está habilitada.`
        }
        modalStore.createMsj('showModalMsj', `${mensaje_.value}`, 2);
        selectedSucursal.value = name; // Actualiza el botón seleccionado
    }
    async function dataCategoria(dato, num){
        modalStore.numerarEstadoModal('objeto_analisis_categoria', 0)//reiniciamos la tabla
        modalStore.numerarEstadoModal('objeto_analisis_producto', 0)//reiniciamos la tabla
        const response = await cargarDatos( `salidas_productos_sucursal_grupo?`+
                                            `sucursal_salidas=${dato.id_sucursal}&`+
                                            `categoria_salidas=${dato.id_categoria}&`+
                                            `year_actual=${anio_.value}`)
        if(response.status === "success") {
            data_analisis.value = crearArrayDatos(response.datos, "nombre")
            titulo_categoria.value = `Análisis de categoría ${dato.nombre}.`
            mensaje_.value = `Datos de la categoría "${dato.nombre}" encontrados.`
            modalStore.numerarEstadoModal('objeto_analisis_categoria', num)
        }else{
            mensaje_.value = `Datos de ${dato.nombre} inexistentes.`
        };
        modalStore.createMsj('showModalMsj', `${mensaje_.value}`, 2);
    }
    async function dataCodigo(dato, num){
        modalStore.numerarEstadoModal('objeto_analisis_producto', 0)//reiniciamos la tabla
        const response = await cargarDatos( `salidas_productos_sucursal/${dato.nombre}?`+
                                            `sucursal_salidas=${dato.id_sucursal}&`+
                                            `year_actual=${anio_.value}`)
        if(response.status === "success") {
            data_analisis.value = crearArrayDatos(response.datos, "nombre")
            titulo_producto.value = `Análisis de producto ${dato.nombre}.`
            mensaje_.value = `Datos del producto "${dato.nombre}" encontrados.`
            modalStore.numerarEstadoModal('objeto_analisis_producto', num)
        }else{
            mensaje_.value = `Datos de ${dato.nombre} inexistentes.`
        }
        modalStore.createMsj('showModalMsj', `${mensaje_.value}`, 2);
    }

    function ticketPromedio(array_categorias_){
        let array_resultado = [];
        for(let i = 0; i < 12; i++){
            let suma = 0;
            let suma_venta = 0;
            array_categorias_.forEach((event)=>{
                suma_venta += event.suma_ventas[i];
                suma += event.suma_veces[i];
            });
            let media = suma_venta/suma > 0 > 0 ? suma_venta/suma : 0;
            array_resultado.push(media)
            if(mayor_ticket.value < media){
                mayor_ticket.value = media;
            }
        };
        return array_resultado;
    };
</script>
<template>
    <div>
        <div :class="{ modal: true, 'modal-show': modalStore.showModalMsj.state }">
            <dial-mo-mensajes />
        </div>
        <div class="contenedor-formularios">
            <div class="botones-cabecera">
                <button 
                    class="btnUno" 
                    :class="{ 'btn-seleccionado': selectedSucursal === sucursal.name }"
                    v-for="sucursal in dbStore._sucursales_nombre"
                    @click="dataSucursal(sucursal.name, 1)"
                >
                    {{ sucursal.name }}
                </button>
            </div>
            
            <table class="tabla_mapa_calor">
                <thead>
                    <tr>
                        <th scope="row" colspan="16"><h2>Ticket promedio</h2></th>
                    </tr>
                    <tr>
                        <th>Ene</th>
                        <th>Feb</th>
                        <th>Mar</th>
                        <th>Abr</th>
                        <th>May</th>
                        <th>Jun</th>
                        <th>Jul</th>
                        <th>Ago</th>
                        <th>Set</th>
                        <th>Oct</th>
                        <th>Nov</th>
                        <th>Dic</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td v-for="event in ticket_promedio" 
                            style="text-align: center;"
                            :style="{ background: dbStore.colorFondo(mayor_ticket, event) }"
                        >
                            {{ 'S/ ' + event.toFixed(2) }}
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div v-if="modalStore.objeto_analisis_sucursal > 0">
                <tab-mapa-calor 
                :titulo="titulo_sucursal"
                :data_analisis="data_analisis"
                nombre="Categoría"
                >
                    <template #actions="{ dato }">
                        <div class="tooltip">
                            <button class="btnUnoB" @click="dataCategoria(dato, 1)">
                                <span 
                                    style="font-size:18px;" class="material-symbols-outlined myButtonEditar">play_arrow
                                </span>
                                <span class="tooltiptext">Detalle por producto</span>
                            </button>
                        </div>
                    </template>
                </tab-mapa-calor >
            </div>
            <div v-if="modalStore.objeto_analisis_categoria > 0">
                <tab-mapa-calor 
                :titulo="titulo_categoria"
                :data_analisis="data_analisis"
                nombre="Código"
                >
                    <template #actions="{ dato }">
                        <div class="tooltip">
                            <button class="btnUnoB" @click="dataCodigo(dato, 1)">
                                <span 
                                    style="font-size:18px;" class="material-symbols-outlined myButtonEditar">play_arrow
                                </span>
                                <span class="tooltiptext">Detalle por producto</span>
                            </button>
                        </div>
                    </template>
                </tab-mapa-calor >
            </div>
            <div v-if="modalStore.objeto_analisis_producto > 0">
                <tab-mapa-calor 
                :titulo="titulo_producto"
                :data_analisis="data_analisis"
                nombre="Código"
                />
            </div>

            
            <div>
                <details>
                    <summary>Mapa de calor</summary>
                    <div>
                        <div style="display: flex;gap: 10px;"><div style="width: 40px;height: 20px;background: #91ff85;"></div><span>Muy Bueno</span></div>
                        <div style="display: flex;gap: 10px;"><div style="width: 40px;height: 20px;background: #C6F556;"></div><span>Bueno</span></div>
                        <div style="display: flex;gap: 10px;"><div style="width: 40px;height: 20px;background: #F5CF6F;"></div><span>Regular</span></div>
                        <div style="display: flex;gap: 10px;"><div style="width: 40px;height: 20px;background: #DE8B59;"></div><span>Malo</span></div>
                        <div style="display: flex;gap: 10px;"><div style="width: 40px;height: 20px;background: #FF666D;"></div><span>Muy Malo</span></div>
                    </div>
                </details>
                
                <details>
                    <summary>Detalle de opciones</summary>
                    <div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Ventas absolutas:
                            </span> Se realiza un análisis de ventas absolutas. Se muestran los valores absolutos de las ventas para cada mes.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Ventas relativas:
                            </span> Se realiza un análisis de ventas relativas. Se muestran los valores relativos de las ventas como un porcentaje del total.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Ganancias absolutas:
                            </span> Se realiza un análisis de ganancias absolutas. Se muestran los valores absolutos de las ganancias para cada mes.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Ganancias relativas:
                            </span> Se realiza un análisis de ganancias relativas. Se muestran los valores relativos de las ganancias como un porcentaje del total.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Unidades absolutas:
                            </span> Se realiza un análisis de unidades absolutas. Se muestran los valores absolutos de las unidades vendidas para cada mes.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Unidades relativas:
                            </span> Se realiza un análisis de unidades relativas. Se muestran los valores relativos de las unidades vendidas como un porcentaje del total.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Recurrencias absolutas:
                            </span> Se realiza un análisis de recurrencias absolutas. Se muestran los valores absolutos del número de ventas para cada mes.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Recurrencias relativas:
                            </span> Se realiza un análisis de recurrencias relativas. Se muestran los valores relativos del número de ventas como un porcentaje del total.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Devoluciones absolutas:
                            </span> Se realiza un análisis de devoluciones absolutas. Se muestran los valores absolutos de las unidades devueltas para cada mes.
                        </div>
                        <div style="display: flex;gap: 10px;align-items: center;">
                            <span style="font-weight: bold;">
                                *Devoluciones relativas:
                            </span> Se realiza un análisis de devoluciones relativas. Se muestran los valores relativos de las unidades devueltas como un porcentaje del total.
                        </div>
                    </div>
                </details>
                
            </div>
        </div>
    </div>
</template>
<style scoped>
.botones-cabecera{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 10px;
    width: 1080px;
    padding: 10px;
    background: var(--fondo-primero);
}

.tabla_mapa_calor{
    width: 1100px;
    
    background: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto));
    padding: 10px;
}

.tabla_mapa_calor tbody tr:hover {
    background-color: var(--fondo-cuarto);
}

.btn-seleccionado {
    background: var(--boton-dos); /* Cambia este color al que desees */
    color: white;
}
</style>