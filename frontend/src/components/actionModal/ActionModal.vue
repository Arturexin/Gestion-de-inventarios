<script setup>
    import { ref, defineProps } from 'vue';
    defineOptions({ inheritAttrs: false });
    import { useModalStore } from '../../stores/modalStore.js'

    const props = defineProps({
        title: {
            type: String,
            required: true
        },
        onButton: {
            type: String,
            required: true
        },
        offButton: {
            type: String,
            required: true
        },
        width: {
            type: String,
            default: '700px'
        }
    });

    const modalStore = useModalStore();
    const closing = ref(false);

    function cerrarAlert () {
        closing.value = true;
    }

    async function confirmar () {
        if (modalStore.actionModalData.onConfirm) {
            await modalStore.actionModalData.onConfirm();
        }
        closing.value = true;
    }

    function onAnimationEnd () {
        if (closing.value) {
            modalStore.closeActionModal();
        }
    }   
</script>

<template>
    <div class="container-alert">

        <div class="container-alert-into" :class="{ 'closing': closing }" :style="{ width: props.width }" @animationend="onAnimationEnd">
            <div class="head-alert">
                <p class="title">
                    {{ props.title }}
                </p>
            </div>
            <div class="body-alert">
                <slot />
                <p style="margin: 0;" v-if="modalStore.actionModalData.description">{{ modalStore.actionModalData.description }}</p>
                <div class="container-boton">
                    <button class="boton" @click="cerrarAlert">{{ props.offButton }}</button>
                    <button class="boton" @click="confirmar">{{ props.onButton }}</button>
                </div>
            </div>
    
        </div>
    </div>
</template>

<style scoped>
    .container-alert {
        /* display: none; */
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--fondo_modal);
        z-index: 1000;
    }
    .container-alert-into {
        display: grid;
        align-items: center;
        border-radius: 8px;
        border-top: 5px solid;    
    }
    .head-alert {
        background: var(--b-a-dark);
        color: var(--c-a-light);
        font-weight: bold;
        font-size: 18px;
        width: 100%;
        height: 32px;
    }
    .body-alert {
        padding: 10px 16px;
        display: grid;
        align-items: center;
        gap: 12px;
        background: var(--b-a-light);
        color: var(--c-a-dark);
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }


    /* Success */
    .container-alert-into.success {
        border-color: var(--success-alert);
        color: var(--success-alert);
    }

    /* Error */
    .container-alert-into.error {
        border-color: var(--error-alert);
        color: var(--error-alert);
    }

    /* Alert */
    .container-alert-into.alert {
        border-color: var(--alert-alert);
        color: var(--alert-alert);
    }

    /* Info */
    .container-alert-into.info {
        border-color: var(--info-alert);
        color: var(--info-alert);
    }
    .title {
        padding: 0 10px;
        margin: 0;
    }
    .container-boton {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }
    .boton {
        background: var(--b-a-dark);
        color: var(--c-a-light);
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }

    /* Animacion de entrada */
    @keyframes alert-in {
        from {
            opacity: 0;
            transform: scale(0.85) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    /* Animacion de salida */
    @keyframes alert-out {
        from {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        to {
            opacity: 0;
            transform: scale(0.85) translateY(-20px);
        }
    }

    .container-alert-into {
        animation: alert-in 0.25s ease-out;
    }

    .container-alert-into.closing {
        animation: alert-out 0.2s ease-in forwards;
    }
</style>
