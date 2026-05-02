<script setup>
    import { ref } from 'vue';
    defineOptions({ inheritAttrs: false });
    import { useModalStore } from '../../stores/modalStore.js'



    const modalStore = useModalStore();
    const closing = ref(false);

    function cerrarAlert () {
        closing.value = true;
    }

    function onAnimationEnd () {
        if (closing.value) {
            modalStore.closeAlert();
        }
    }   
</script>

<template>
    <div class="container-alert">

        <div class="container-alert-into" :class="[modalStore.alertData.type, { 'closing': closing }]" :style="{ width: modalStore.alertData.width }" @animationend="onAnimationEnd">
            <div class="head-alert">
                <p class="title">
                    {{ modalStore.alertData.title }}
                </p>
            </div>
            <div class="body-alert">
    
                <!-- Icono segun tipo -->
                <div class="icon">
                    <!-- Success -->
                    <svg v-if="modalStore.alertData.type === 'success'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M7 13l3 3 7-7" />
                </svg>
    
                <!-- Error -->
                <svg v-else-if="modalStore.alertData.type === 'error'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
    
                <!-- Alert -->
                <svg v-else-if="modalStore.alertData.type === 'alert'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
    
                <!-- Info -->
                <svg v-else-if="modalStore.alertData.type === 'info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                </div>
            
                <div class="body-message">
                    <p>{{ modalStore.alertData.description }}</p>
                    <div class="container-boton">

                        <button class="boton" @click="cerrarAlert">{{ modalStore.alertData.nameButton }}</button>
                    </div>
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
        display: flex;
        align-items: center;
        gap: 12px;
        background: var(--b-a-light);
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    .body-message {
        color: var(--c-a-dark);
        font-size: 14px;
        width: 100%;
    }
    .icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
    }

    .icon svg {
        width: 100%;
        height: 100%;
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
        justify-content: flex-end;
        margin-top: 16px;
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
