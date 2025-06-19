<script setup>
    import { defineProps, computed } from 'vue';
    import { useModalStore } from '../../stores/modalStore';

    //props
    const props = defineProps({
        titulo_reporte: {
            type: String,
            required: true
        },
        data_reporte: {
            type: Array,
            required: true
        },
    })
    const modalStore = useModalStore();
    function cerrarReportes(){
        modalStore.eliminarModal('showModalReportes')
    }
    // Computed property to calculate the total sum of monto_credito
    const sumaMontoCredito = computed(() => {
        return props.data_reporte.reduce((total, reporte) => {
            return total + reporte.monto_credito;
        }, 0).toFixed(2);
    });

    const sumaSaldoCredito = computed(() => {
        return props.data_reporte.reduce((total, reporte) => {
            return total + reporte.saldo_credito;
        }, 0).toFixed(2);
    });

    const totalPorcentajePagado = computed(() => {
        const sumaMonto = parseFloat(sumaMontoCredito.value);
        const sumaSaldo = parseFloat(sumaSaldoCredito.value);
        return Math.round((1 - (sumaSaldo / sumaMonto)) * 100);
    });
</script>

<template>
    <div class="rep_">
        <div>
            <h2>{{ props.titulo_reporte }}</h2>
        </div>
        <table class="tabla-proforma " id="tabla_resporte">
            <thead>
                <tr>
                    <th style="width: 120px; text-align: center;">Sucursal</th>
                    <th style="width: 120px; text-align: center;">Comprobante</th>
                    <th style="width: 150px; text-align: center;">Cliente</th>
                    <th style="width: 90px; text-align: center;">Monto</th>
                    <th style="width: 90px; text-align: center;">Saldo</th>
                    <th style="width: 90px; text-align: center;">Avance</th>
                    <th style="width: 90px; text-align: center;">Días activo</th>
                    <th style="width: 200px; text-align: center;">Fecha de inicio</th>
                    <th style="width: 90px; text-align: center;">Teléfono</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="reporte in props.data_reporte">
                    <td>{{ reporte._sucursal }}</td>
                    <td>{{ reporte.tipo_comprobante }}</td>
                    <td>{{ reporte.nombre_cli }}</td>
                    <td style="text-align: end;">{{ (reporte.monto_credito).toFixed(2) }}</td>
                    <td style="text-align: end;">{{ (reporte.saldo_credito).toFixed(2) }}</td>
                    <td style="text-align: end;">{{ Math.round((1 - (reporte.saldo_credito / reporte.monto_credito)) * 100) }}%</td>
                    <td style="text-align: center;">{{ Math.floor((new Date() - new Date(reporte.fecha_)) / (1000 * 60 * 60 * 24)) }} días</td>
                    <td style="text-align: center;">{{ reporte.fecha_inicio }}</td>
                    <td>{{ reporte.telefono_cli }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row" colspan="3">Total monto cuentas activas: {{ sumaMontoCredito }}</th>
                    <th scope="row" colspan="3">Total saldo adeudado: {{ sumaSaldoCredito }}</th>
                    <th scope="row" colspan="3">Total porcentaje pagado: {{Math.round((1 - (sumaSaldoCredito/sumaMontoCredito)) * 100)}}%</th>
                </tr>
            </tfoot>
        </table>
        <h4 style="text-align: center;">{{new Date()}}</h4>
        <div style="display: flex; gap: 10px;">

            <button onclick="window.print()" class="btnUnoB">Imprimir</button>
            <button @click="cerrarReportes" class="btnDosB">Cerrar</button>
        </div>
    </div>
</template>

<style scoped>
.rep_ {
  display: grid;
  justify-items: center;
  max-height: 90vh; /* Ajusta la altura máxima según tus necesidades */
  overflow-y: auto; /* Agrega scroll vertical */
}
</style>