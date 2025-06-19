<script setup>

    import { defineProps } from 'vue';
    import { useModalStore } from '../../stores/modalStore';

    //props
    const props = defineProps({
        clickFuncion: {
            type: Function,
            required: false
        }
    });

    const modalStore = useModalStore();
    function cerrarModalMensajes(){
        modalStore.deleteMsj('showModalMsj')
    }

</script>

<template>
    <div class="modal-content">
        <p>{{ modalStore.showModalMsj.message }}</p>
        <div class="botones_respuesta" v-if="modalStore.showModalMsj.opt_1">
            <button id="si_aceptar" class="btnUno" @click="props.clickFuncion">Sí</button>
            <button id="no_salir" class="btnDos" @click="cerrarModalMensajes">No</button>
        </div>
        <div class="botones_respuesta" v-if="modalStore.showModalMsj.opt_2">
            <button id="si_salir" class="btnUno" @click="cerrarModalMensajes">Aceptar</button>
        </div>
    </div>
</template>

<style scoped>
.botones_respuesta{
    display: flex;
    gap: 10px;
    justify-content: center;
}
</style>