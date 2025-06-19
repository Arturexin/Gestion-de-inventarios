<script setup>
    import { defineProps, ref, watch, nextTick, onMounted } from 'vue';
    import { useModalStore } from '../../stores/modalStore';
    import { useDataBases } from '../../stores/dataBases';


    //props
    const props = defineProps({
        data_cliente: {
            type: Array,
            required: false
        },
        data_credito: {
            type: Array,
            required: true
        },
        data_venta: {
            type: Object,
            required: true
        },
        clickFunctionProcesar: {
            type: Function,
            required: true
        },clickFunctionRevertir: {
            type: Function,
            required: true
        },
    });
    //states
    
    const saldo_pendiente = ref(0);
    const efectivo_ = ref(0);
    const tarjeta_ = ref(0);
    const devolucion_ = ref(0);
    const perdida_ = ref(0);
    const modalStore = useModalStore();
    const dbStore = useDataBases();
    //methods
    
    class objetoCredito {
        constructor(id_detalle, id_sucursal, sucursal_nombre, tipo_comprobante, efectivo, tarjeta, tasa, a_monto, a_interes, saldo_monto, saldo_interes, saldo_total, saldo_perdida, fecha_cre, devolucion) {
            this.id_detalle = id_detalle;
            this.id_sucursal = id_sucursal;
            this.sucursal_nombre = sucursal_nombre;
            this.tipo_comprobante = tipo_comprobante;
            this.efectivo = efectivo;
            this.tarjeta = tarjeta;
            this.tasa = tasa;
            this.a_monto = a_monto;
            this.a_interes = a_interes;
            this.saldo_monto = saldo_monto;
            this.saldo_interes = saldo_interes;
            this.saldo_total = saldo_total;
            this.saldo_perdida = saldo_perdida;
            this.fecha_cre = fecha_cre;
            this.situacion = this.saldo_perdida > 0 ? "pérdida" : this.saldo_total > 0 ? "pendiente" : "liquidado";
            this.devolucion = devolucion;
        };
        calcular() {
            let tasa = 1 + props.data_credito[props.data_credito.length - 1].tasa / 100
            this.efectivo = Number(efectivo_.value);
            this.tarjeta = Number(tarjeta_.value);
            this.saldo_perdida = Number(perdida_.value);
            let pago_ = this.efectivo + this.tarjeta;
            this.a_monto = this.redondear(pago_/tasa);
            this.a_interes = this.redondear(pago_ - this.a_monto);
            this.saldo_monto = this.redondear(props.data_credito[props.data_credito.length - 1].saldo_monto - this.a_monto);
            this.saldo_interes = this.redondear(props.data_credito[props.data_credito.length - 1].saldo_interes - this.a_interes);
            this.saldo_total = this.redondear(this.saldo_monto + this.saldo_interes - this.saldo_perdida - this.devolucion);

            saldo_pendiente.value = this.saldo_total;
            return this.a_monto
        }

        declarar_perdida(){
            let _input_pendiente = document.getElementById("accion_pendiente");
            _input_pendiente.style.background = "";
            efectivo_.value = 0;
            tarjeta_.value = 0;  
            
            document.getElementById("accion_perdida").value = saldo_pendiente.value
            if(document.querySelector("#check_perdida").checked){
                perdida_.value = props.data_credito[props.data_credito.length - 1].saldo_total;
                document.getElementById("accion_efectivo").setAttribute("disabled", "true")
                document.getElementById("accion_tarjeta").setAttribute("disabled", "true")
            }else{
                perdida_.value = 0;
                document.getElementById("accion_efectivo").removeAttribute("disabled")
                document.getElementById("accion_tarjeta").removeAttribute("disabled")
            }
            this.calcular();
        }
        redondear(valor, decimales = 2){
            return parseFloat(valor.toFixed(decimales))
        }
    }
    async function procesarData() {
        //reiniciamos todas las variables
        efectivo_.value = 0;
        tarjeta_.value = 0;
        saldo_pendiente.value = 0;
        perdida_.value = 0;
        document.getElementById("check_perdida").checked = false;
        dbStore.array_creditos = []; // Limpiar datos procesados antes de agregar nuevos

        let devolucion_ = props.data_venta.modo_perdida - props.data_venta.modo_efectivo - props.data_venta.modo_tarjeta;
        let dev_ = devolucion_ > 0 ? devolucion_ : 0;
        saldo_pendiente.value = props.data_credito[props.data_credito.length - 1].saldo_total - dev_;
        
        dbStore.array_creditos.push(new objetoCredito(
            props.data_venta.id_det_ventas,//id_detalle
            props.data_venta.id_sucursales,//id_sucursal
            props.data_venta.sucursal_nombre,//sucursal_nombre
            props.data_venta.tipo_comprobante,//tipo_comprobante
            efectivo_.value,//efectivo
            tarjeta_.value,//tarjeta
            props.data_credito[0].tasa,//tasa
            0,//amortizacion monto
            0,//amortizacion interés
            0,//saldo monto
            0,//saldo interés
            saldo_pendiente.value,//saldo total
            0,//saldo pérdida
            "",//fecha
            dev_,//devoluciones
        ));
        console.log(dbStore.array_creditos)
    };
    function cerrarCredito(){
        modalStore.eliminarModal('showModalCreditos')
    }
    
    onMounted(async () => {
        procesarData()
    });
    watch(() => modalStore.showModalCreditos, async (newVal) => {
        if (newVal === true) {
            await nextTick();
            procesarData();
        }
    });

</script>

<template>
    <div id="form_accion_rapida" class="nuevo-contenedor-box" style="border: 2px solid var(--boton-tres);background: var(--fondo-primero);">
        <h2 style="text-align: center;">Cliente: {{ props.data_venta.nombre_cli }}</h2>
        
        <table class="tabla-proforma" id="tabla_credito">
            <thead>
                <tr>
                    <th>Sucursal</th>
                    <th>Tipo de comprobante</th>
                    <th>Pago efectivo</th>
                    <th>Pago tarjeta</th>
                    <th>Tasa de interés</th>
                    <th>Amorti-zación monto</th>
                    <th>Amorti-zación interés</th>
                    <th>Saldo monto</th>
                    <th>Saldo interés</th>
                    <th>Saldo total</th>
                    <th>Saldo pérdida</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="credito in props.data_credito" :key="credito.id_detalle">
                    <td style="text-align: center; width: 140px">{{ credito.sucursal_nombre }}</td>
                    <td style="text-align: center; width: 140px">{{ credito.tipo_comprobante }}</td>
                    <td style="text-align: center; width: 80px">{{ (credito.efectivo).toFixed(2) }}</td>
                    <td style="text-align: center; width: 80px">{{ (credito.tarjeta).toFixed(2) }}</td>
                    <td style="text-align: center; width: 80px">{{ (credito.tasa).toFixed(2) }}%</td>
                    <td style="text-align: center; width: 80px">{{ (credito.a_monto).toFixed(2) }}</td>
                    <td style="text-align: center; width: 80px">{{ (credito.a_interes).toFixed(2) }}</td>
                    <td style="text-align: center; width: 80px">{{ (credito.saldo_monto).toFixed(2) }}</td>
                    <td style="text-align: center; width: 80px">{{ (credito.saldo_interes).toFixed(2) }}</td>
                    <td style="text-align: center; width: 80px">{{ (credito.saldo_total).toFixed(2) }}</td>
                    <td style="text-align: center; width: 80px">{{ (credito.saldo_perdida).toFixed(2) }}</td>
                    <td style="text-align: center; width: 100px">{{ credito.fecha_cre }}</td>
                </tr>
            </tbody>
        </table>
        <br>
        <div style="display: flex; justify-content: space-evenly; align-items: baseline;">
            <div>
                <label class="label-general" style="border: 1px solid var(--boton-dos); padding-left: 3px">Deuda inicial
                    <span style="width: 100px; text-align: center; background: var(--boton-dos);" > 
                        {{ props.data_credito.length > 0 ? (props.data_credito[0].saldo_total).toFixed(2): "0.00" }} 
                    </span>
                </label>
                <label class="label-general" style="border: 1px solid var(--boton-uno); padding-left: 3px">Saldo adeudado
                    <span style="width: 100px; text-align: center; background: var(--boton-uno);" > 
                        {{ props.data_credito.length > 0 ? (props.data_credito[props.data_credito.length - 1].saldo_total).toFixed(2): "0.00" }}
                    </span>
                </label>
                <label class="label-general" style="border: 1px solid rgb(113, 89, 142); padding-left: 3px">Devolución
                    <span style="width: 100px; text-align: center; background: rgb(113, 89, 142);" >{{ (devolucion_).toFixed(2) }}</span>
                </label>
            </div>
            <div style="display: grid; justify-items: center;align-items: center;">
                <label class="label-general">Pago en efectivo</label>
                <input  id="accion_efectivo" class="input-numero" type="text" v-model="efectivo_" @input="dbStore.array_creditos[0].calcular()">
            </div>
            <div style="display: grid; justify-items: center;align-items: center;">
                <label class="label-general">Pago con tarjeta</label>
                <input  id="accion_tarjeta" class="input-numero" type="text" v-model="tarjeta_" @input="dbStore.array_creditos[0].calcular()">
            </div>
            <div style="display: grid; justify-items: center;align-items: center;">
                <label class="label-general">Saldo pendiente</label>
                <input id="accion_pendiente" class="input-numero" style="font-size: 20px;" disabled v-model="saldo_pendiente">
            </div>
            <div style="display: grid; justify-items: center;align-items: center;">
                <label class="label-general">Pérdida <input id="check_perdida" type="checkbox" @click="dbStore.array_creditos[0].declarar_perdida()"></label>
                <input style="color: red; font-size: 20px;" id="accion_perdida" class="input-numero" type="text" placeholder="00.00" v-model="perdida_" disabled>
            </div>
        </div>
        <div style="display: flex;justify-content: center;gap: 10px; margin: 10px;">
            <button id="accion_procesar_pago" class="btnUnoB" @click="props.clickFunctionProcesar">Procesar Pago</button>
            <button id="revertir_credito" class="btnDosB" @click="props.clickFunctionRevertir">Revertir último pago</button>
            <button id="remover_accion_rapida" class="btnDosB" @click="cerrarCredito">Cancelar</button>
        </div>
    </div>`
</template>

<style scoped>

</style>