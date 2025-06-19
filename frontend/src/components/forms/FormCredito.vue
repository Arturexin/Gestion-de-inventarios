<script setup>
    import { useDataBases } from '../../stores/dataBases';
    import { ref, watch, computed, defineProps, onMounted } from 'vue';


    const dbStore = useDataBases();

    const props = defineProps({
        total_importe: {
            type: Number,
            required: true
        }
    });

    const cuota_combinado = ref('0.00'); 

    const metodoDePago = ref('');

    const color_combinado = ref('');
    const color_tasa = ref('');

    const isEfectivoDisabled = computed(() => metodoDePago.value !== 'combinado');
    const isTarjetaDisabled = computed(() => metodoDePago.value !== 'combinado');
    const isCreditoDisabled = computed(() => metodoDePago.value !== 'combinado');

    function calcularCombinado(){
        if(metodoDePago.value === 'combinado'){
            cuota_combinado.value = (Number(props.total_importe) - 
                                    (Number(dbStore.v_.objeto_modo_pago.modo_efectivo) + 
                                    Number(dbStore.v_.objeto_modo_pago.modo_tarjeta) + 
                                    Number(dbStore.v_.objeto_modo_pago.modo_credito))).toFixed(2);
        }

        if(Number(cuota_combinado.value) > Number(props.total_importe) || Number(cuota_combinado.value) < 0 ||
        isNaN(Number(cuota_combinado.value))){
            color_combinado.value = 'red';
        }else if(Number(cuota_combinado.value) === 0 && !isNaN(Number(cuota_combinado.value))){
            color_combinado.value = 'green';
        }else{
            color_combinado.value = '';
        }
    }
    
    function metodo(){
        dbStore.v_.objeto_modo_pago.modo_efectivo = '0.00';
        dbStore.v_.objeto_modo_pago.modo_tarjeta = '0.00';
        dbStore.v_.objeto_modo_pago.modo_credito = '0.00';
        cuota_combinado.value = '0.00';
        color_combinado.value = '';
        if (metodoDePago.value === 'efectivo'){
            dbStore.v_.objeto_modo_pago.modo_efectivo = props.total_importe.toFixed(2);
        } else if(metodoDePago.value === 'tarjeta'){
            dbStore.v_.objeto_modo_pago.modo_tarjeta = props.total_importe.toFixed(2);
        } else if(metodoDePago.value === 'credito'){
            dbStore.v_.objeto_modo_pago.modo_credito = props.total_importe.toFixed(2);
        } else if(metodoDePago.value === 'combinado'){
            cuota_combinado.value = props.total_importe.toFixed(2);
        }
    }
    function calcularCredito(){
        if(metodoDePago.value === 'credito'){
            if(dbStore.v_.objeto_credito.tasa >= 0 && !isNaN(dbStore.v_.objeto_credito.tasa)){
                dbStore.v_.objeto_credito.saldo_interes = (Number(props.total_importe) * (dbStore.v_.objeto_credito.tasa) / 100);
                dbStore.v_.objeto_credito.saldo_total = (Number(props.total_importe) + dbStore.v_.objeto_credito.saldo_interes);
                color_tasa.value = '';
            }else if(dbStore.v_.objeto_credito.tasa < 0 || isNaN(dbStore.v_.objeto_credito.tasa)){
                color_tasa.value = 'red';
            }
        }else if(metodoDePago.value === 'combinado'){
            if(dbStore.v_.objeto_credito.tasa >= 0 && !isNaN(dbStore.v_.objeto_credito.tasa)){
                dbStore.v_.objeto_credito.saldo_interes = Number(dbStore.v_.objeto_modo_pago.modo_credito) * (Number(dbStore.v_.objeto_credito.tasa) / 100);
                dbStore.v_.objeto_credito.saldo_total = Number(dbStore.v_.objeto_modo_pago.modo_credito) + Number(dbStore.v_.objeto_credito.saldo_interes);
                color_tasa.value = '';
            }else if(Number(dbStore.v_.objeto_credito.tasa) < 0 || isNaN(Number(dbStore.v_.objeto_credito.tasa))){
                color_tasa.value = 'red';
            }
        }else{
            dbStore.v_.objeto_credito.tasa = 0;
            dbStore.v_.objeto_credito.saldo_interes = 0;
            dbStore.v_.objeto_credito.saldo_total = 0;
        }
    }
    function formatearValor(propiedad) {
        const valor = Number(dbStore.v_.objeto_modo_pago[propiedad]);
        dbStore.v_.objeto_modo_pago[propiedad] = isNaN(valor) ? '0.00' : valor.toFixed(2);
    }
    function eventoCheckCanal(){
        dbStore.v_.objeto_modo_pago.canal_venta = !dbStore.v_.objeto_modo_pago.canal_venta;
    }
    watch(() => props.total_importe, (newVal) => {
        metodoDePago.value = 'efectivo';
        dbStore.v_.objeto_modo_pago.modo_efectivo = newVal.toFixed(2);
        dbStore.v_.objeto_modo_pago.modo_tarjeta = '0.00';
        dbStore.v_.objeto_modo_pago.modo_credito = '0.00';
        cuota_combinado.value = '0.00';
        dbStore.v_.objeto_credito.tasa = 0;
        dbStore.v_.objeto_credito.saldo_interes = 0;
        dbStore.v_.objeto_credito.saldo_total = 0;
        color_combinado.value = '';
        color_tasa.value = '';
    });

    watch(metodoDePago, (newVal) => {
        metodo();
        calcularCredito();
    });
    onMounted(() => {
        dbStore.v_.objeto_modo_pago.canal_venta = false;
    });
</script>

<template>
    <div class="modo_credito">
        <div class="modo_credito_interno">
            <label class="label-metodo-pago">Efectivo
                <input class="inputRadioVentas" type="radio" name="radioMetodoDePago" value="efectivo" v-model="metodoDePago" @click="metodo">
                <input class="input-metodo-pago" type="text" 
                    v-model="dbStore.v_.objeto_modo_pago.modo_efectivo" 
                    :disabled="isEfectivoDisabled" 
                    @input="calcularCombinado"
                    @blur="formatearValor('modo_efectivo')">
            </label>
            <label class="label-metodo-pago">Tarjeta 
                <input class="inputRadioVentas" type="radio" name="radioMetodoDePago" value="tarjeta" v-model="metodoDePago" @click="metodo">
                <input class="input-metodo-pago" type="text" 
                    v-model="dbStore.v_.objeto_modo_pago.modo_tarjeta" 
                    :disabled="isTarjetaDisabled" 
                    @input="calcularCombinado" 
                    @blur="formatearValor('modo_tarjeta')">
            </label>
            <label class="label-metodo-pago">Crédito 
                <input class="inputRadioVentas" type="radio" name="radioMetodoDePago" value="credito" v-model="metodoDePago" @click="metodo">
                <input class="input-metodo-pago" type="text" 
                    v-model="dbStore.v_.objeto_modo_pago.modo_credito" 
                    :disabled="isCreditoDisabled" 
                    @input="calcularCombinado" 
                    @blur="formatearValor('modo_credito')">
            </label>
            <label class="label-metodo-pago">Combinado 
                <input class="inputRadioVentas" type="radio" name="radioMetodoDePago" value="combinado" v-model="metodoDePago">
                <input class="input-metodo-pago" type="text" v-model.number="cuota_combinado" disabled :style="{ background: color_combinado }">
            </label>
            <label class="label-checkbox">Delivery 
                <input type="checkbox" @click="eventoCheckCanal()">
            </label>
        </div>
        <div class="modo_credito_interno invisible">
            <label class="label-metodo-pago">Tasa
                <input 
                    class="input-metodo-pago fondo-input" type="text" 
                    v-model.number="dbStore.v_.objeto_credito.tasa" style="margin: 0 5px 0 10px;" 
                    :style="{ color: color_tasa }"
                    @input="calcularCredito()">%
            </label>
            <label class="label-metodo-pago">Interés
                <span class="input_number_disabled" style="margin: 0 18px 0 10px;">{{ dbStore.v_.objeto_credito.saldo_interes.toFixed(2) }}</span>
            </label>
            <label class="label-metodo-pago">Total
                <span class="input_number_disabled" style="margin: 0 18px 0 10px;">{{ dbStore.v_.objeto_credito.saldo_total.toFixed(2) }}</span>
            </label>
        </div>
    </div>

</template>

<style scoped>
.modo_credito{
    display: flex;
    gap: 10px;
}
.modo_credito_interno{
    background: var(--fondo-primero);
    padding: 10px;
}
._credito{
    height: 95px;
    padding: 5px;
    background: var(--fondo-primero);
}
.label-metodo-pago {
    display: flex;
    margin: 3px 0px;
    margin-right: 10px;
    width: 100%;
    justify-content: flex-end;
    align-items: stretch;
}
.inputRadioVentas{
    margin: 0px 10px;
}
.input-metodo-pago {
    width: 80px;
    text-align: right;
    padding: 4px;
    border: 1px solid #ccc;
}
.input_number_disabled{
    width: 88px;
    border: 1px solid var(--border-principal);
    background: var(--fondo-primero);
    text-align: right;
}


.label-checkbox{
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid var(--border-principal);
}
</style>