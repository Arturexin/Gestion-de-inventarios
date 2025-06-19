<script setup>
    import { ref, computed, defineProps, onMounted } from 'vue';
    import { useModalStore } from '../../stores/modalStore';

    const props = defineProps({
        titulo:{
            type: String,
            required: true
        },
        db:{
            type: Array,
            required: true
        }
    })

    const db_copy = ref([]);

    const modalStore = useModalStore();

    const totalQAc = computed(() => props.db.reduce((sum, event) => sum + (event.q_ac || 0), 0));
    const totalQSu = computed(() => props.db.reduce((sum, event) => sum + (event.q_su || 0), 0));
    const totalQSd = computed(() => props.db.reduce((sum, event) => sum + (event.q_sd || 0), 0));
    const totalQSt = computed(() => props.db.reduce((sum, event) => sum + (event.q_st || 0), 0));
    const totalQSc = computed(() => props.db.reduce((sum, event) => sum + (event.q_sc || 0), 0));
    const total_compra = computed(() => props.db.reduce((sum, event) => sum + ((event.q_ac + event.q_su + event.q_sd + event.q_st + event.q_sc) * event.costo), 0).toFixed(2));


    function print() {
        window.print();
    }
    function closeModal() {
        modalStore.eliminarModal('showModalPrintPr')
        db_copy.value = []; // Limpiar la copia de seguridad al cerrar el modal
    }
    onMounted(() => {
        db_copy.value = [...props.db]; // Copia de seguridad de los datos originales
    });
</script>

<template>
    <div style="background: #eee; color: #000">
        <table>
            <caption><h3>{{ props.titulo }}</h3></caption>
            <thead>
                
                <tr>
                    <th style="width: 100px;">Categoria</th>
                    <th style="width: 110px;">Código</th>
                    <th style="width: 150px;">Descripción</th>
                    <th style="width: 80px;">Medidas</th>
                    <th style="background: var(--suc-uno)">Q AC</th>
                    <th style="background: var(--suc-dos)">Q SU</th>
                    <th style="background: var(--suc-tres)">Q SD</th>
                    <th style="background: var(--suc-cuatro)">Q ST</th>
                    <th style="background: var(--suc-cinco)">Q SC</th>
                    <th style="width: 80px;">Costo Unitario</th>
                    <th style="width: 80px;">Costo Total</th>
                    <th style="width: 80px;">Precio de Venta</th>
                    <th>Lote</th>
                    <th>Proveedor</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in db_copy" :key="event.codigo">
                    <td>{{ event.name_cat }}</td>
                    <td>{{ event.codigo }}</td>
                    <td>{{ event.descripcion }}</td>
                    <td style="text-align: center;">{{ event.talla }}</td>
                    <td style="text-align: right;">{{ event.q_ac }}</td>
                    <td style="text-align: right;">{{ event.q_su }}</td>
                    <td style="text-align: right;">{{ event.q_sd }}</td>
                    <td style="text-align: right;">{{ event.q_st }}</td>
                    <td style="text-align: right;">{{ event.q_sc }}</td>
                    <td style="text-align: right;">{{ event.costo }}</td>
                    <td style="text-align: right;">{{ ((event.q_ac + event.q_su + event.q_sd + event.q_st + event.q_sc) * event.costo).toFixed(2) }}</td>
                    <td style="text-align: right;">{{ event.precio }}</td>
                    <td style="text-align: center;">{{ event.lote }}</td>
                    <td>{{ event.name_prov }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th scope="row" colspan="4" >Total</th>
                    <th style="text-align: right;">{{ totalQAc }}</th>
                    <th style="text-align: right;">{{ totalQSu }}</th>
                    <th style="text-align: right;">{{ totalQSd }}</th>
                    <th style="text-align: right;">{{ totalQSt }}</th>
                    <th style="text-align: right;">{{ totalQSc }}</th>
                    <th style="text-align: right;"></th>
                    <th style="text-align: right;">{{ total_compra }}</th>
                </tr>
                <tr>
                    <th scope="row" colspan="14">{{ new Date() }}</th>
                </tr>
                
                <tr>
                    <th scope="row" colspan="7"><button @click="print()">Imprimir</button></th>
                    <th scope="row" colspan="7"><button @click="closeModal()">Cerrar</button></th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style scoped>

</style>