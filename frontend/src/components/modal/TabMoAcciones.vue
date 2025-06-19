<script setup>

    import { defineProps, watch, nextTick } from 'vue';
    import { useModalStore } from '../../stores/modalStore';
    import { useDataBases } from '../../stores/dataBases';

    //props
    const props = defineProps({
        titulo: {
            type: String,
            required: true
        },
        data: {
            type: Object,
            required: true
        },
        name_button: {
            type: String,
            required: true
        },
        clickFuncion: {
            type: Function,
            required: false
        },
        db_data_sucursales: {
            type: Array,
            required: true
        },
    });

    const modalStore = useModalStore();
    const dbStore = useDataBases();

    //methods
    function cerrarModalMensajesTablas(){
        modalStore.eliminarModal('showModalAcciones')
        modalStore.numerarEstadoModal('llenarShowModalAcciones', 0)
    }
    class ObjetoData {
        constructor(nombre_sucursal, existencias_sucursal, id_sucursal, input_number, input_check) {
            this.nombre_sucursal = nombre_sucursal;
            this.existencias_sucursal = existencias_sucursal;
            this.id_sucursal = id_sucursal;
            this.input_number = input_number;
            this.input_check = input_check;
        };
    };

    function procesarData() {
        dbStore.array_com_tra = []; // Limpiar datos procesados antes de agregar nuevos
        dbStore._sucursales_nombre.forEach((sucursal) => {
            let coincidencia = props.db_data_sucursales.find(x => x.sucursal_nombre == sucursal.name);
            if (coincidencia) {
                dbStore.array_com_tra.push(new ObjetoData(
                    sucursal.name,
                    props.data[sucursal.stock],
                    coincidencia.id_sucursales,
                    0, 
                    false
                ));
            }
        });
    };

    function sucursalOrigen(){// Inhabilita el input de la sucursal de orígen de la transferencia
        let radios = document.querySelectorAll(".suc_tran")
        radios.forEach((e, i)=>{
            dbStore.array_com_tra[i].input_check = e.checked;
            dbStore.array_com_tra[i].input_number = 0;
            let row_ = e.closest("tr")
            row_.children[3].style.background = "";
            row_.children[2].children[0].value = 0;
            row_.children[3].textContent = row_.children[1].textContent;
            if(e.checked){
                row_.children[2].children[0].setAttribute("disabled", "true")
            }else{
                row_.children[2].children[0].removeAttribute("disabled")
            }
        });
    };
    function op_cantidad(e){// Opera las cantidades a transferir o recomprar con respecto a las existencias
        let row_ = e.target.closest("tr");

        row_.children[3].textContent = Number(row_.children[1].textContent) + Number(row_.children[2].children[0].value )

        Number(row_.children[2].children[0].value < 0) ?    row_.children[2].children[0].style.background = "var(--boton-dos)": 
                                                            row_.children[2].children[0].style.background = "";
        Number(row_.children[3].textContent) < 0 || 
        isNaN(Number(row_.children[3].textContent)) ?   row_.children[3].style.background = "var(--boton-dos)": 
                                                        row_.children[3].style.background = "";

        if(modalStore.llenarShowModalAcciones === 2){
            sumaTranSucursales();  
        }
    };
    function sumaTranSucursales(){//Suma las cantidades de los inputs a transferir
        let elementos = document.querySelectorAll(".q_");
        let valores = Array.from(elementos).map(elemento => Number(elemento.value));
        let suma = valores.reduce((acumulador, valor) => acumulador + valor, 0);

        elementos.forEach((e)=>{
            let row_ = e.closest("tr")
            if(row_.children[5].children[0].checked){
                row_.children[3].textContent = Number(row_.children[1].textContent) - suma
                row_.children[3].textContent < 0 ?  row_.children[3].style.background = "var(--boton-dos)": 
                                                    row_.children[3].style.background = "var(--boton-tres)";
            }
        })
        return Number(suma);
    }
    // Watcher para ejecutar procesarData cuando llenarShowModalCompra cambie a true
    watch(() => modalStore.llenarShowModalAcciones, async (newVal) => {
        if (newVal === 1 || newVal === 2) {
            await nextTick();
            procesarData();
            if (newVal === 2) {
                await nextTick();
                const firstRadio = document.querySelector(".suc_tran");
                if (firstRadio) {
                    firstRadio.checked = true;
                    sucursalOrigen();
                }
            }
        }
    });
</script>

<template>
    <div>
        <table class="tabla_modal contenido-tabla" style="width: 600px;">
            <thead>
                <tr>
                    <th scope="row" colspan="15">
                        <h2>{{ props.titulo }}</h2>
                    </th>
                </tr>
                <tr>
                    <th style="width: 120px;">Categoría</th>
                    <th style="width: 120px;">Código</th>
                    <th style="width: 200px;">Descripción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td id="id_prod" class="inv">{{ props.data.idProd }}</td>
                    <td style="width: 120px; text-align: center;">{{ props.data.categoria_nombre }}</td>
                    <td style="width: 120px; text-align: center;">{{ props.data.codigo }}</td>
                    <td style="width: 200px; text-align: center;">{{ props.data.descripcion }}</td>
                </tr>
            </tbody>
        </table>
        <br>
        <table class="tabla-proforma" id="tabla_proforma_producto" style="width: 600px;">
            <thead>
                <tr>
                    <th>Sucursal</th>
                    <th>Existencias</th>
                    <th v-if="modalStore.llenarShowModalAcciones === 1">Recompra</th>
                    <th v-if="modalStore.llenarShowModalAcciones === 2">Transferencia</th>
                    <th>Saldo</th>
                    <th v-if="modalStore.llenarShowModalAcciones === 2">Origen</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(sucursal, index) in dbStore.array_com_tra" :key="index">
                    <td class="nom_suc" :style="{ textAlign: 'center', width: '180px', borderLeft: '7px solid ' + dbStore.CS(sucursal.nombre_sucursal) }">
                        {{ sucursal.nombre_sucursal }}
                    </td>
                    <td style="text-align: center; width: 90px">{{ sucursal.existencias_sucursal }}</td>
                    <td style="text-align: center; width: 180px;">
                        <input class="input-tablas-dos-largo q_" v-model.number="sucursal.input_number" @input="op_cantidad($event)" :disabled="sucursal.input_check">
                    </td>
                    <td style="text-align: center; width: 90px" class="s_">{{ sucursal.existencias_sucursal }}</td>
                    <td class="inv">{{ sucursal.id_sucursal }}</td><!-- id de la sucursal -->
                    <td  v-if="modalStore.llenarShowModalAcciones === 2">
                        <input class="suc_tran" type="radio" name="radioMetodoDePago" @click="sucursalOrigen()">
                    </td>
                    <td class="inv">{{ index }}</td><!-- indice de la sucursal -->
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    
                    <th scope="row" colspan="15">
                        <div style="display: grid;gap: 10px; grid-template-columns: 30% 30%;justify-content: center;">
                            
                            <button class="btnUnoB" @click="props.clickFuncion">{{ props.name_button }}</button>
                            <button class="btnDosB" @click="cerrarModalMensajesTablas()">Cancelar</button>
                        </div>
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style scoped>
.botones_respuesta{
    display: flex;
    gap: 10px;
    justify-content: center;
}
.input-tablas-dos-largo{
    text-align: center;
    height: 18px;
    width: 90px;
    margin: 0px 5px;
    border: none;
    padding: 2px;
}
</style>