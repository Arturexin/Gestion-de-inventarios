import { defineStore } from "pinia";

export const useModalStore = defineStore('modal', {
    state: () => ({
        alerts: false,
        alertData: {
            type: 'success',
            title: '',
            description: '',
            width: '400px',
            nameButton: 'Aceptar',
        },
        actionModal: false,
        actionModalData: {
            onConfirm: null,
            description: '',
        },

        showModalA: false,
        showModalB: false,
        showModalC: false,
        showModalD: false,
        showModalE: false,
        showModalF: false,
        showModalMensajes: false,
        showModalPrintPr: false,
        showModalMsj: {
            state: false,
            message: '',
            opt_1: false,
            opt_2: false
        },
        showModalMensajes_b: false,
        init_db: [],

        showModalAcciones: false,
        showModalTickets: false,
        showModalCreditos: false,
        showModalReportes: false,
        objeto_analisis_sucursal: 0,
        objeto_analisis_categoria: 0,
        objeto_analisis_producto: 0,
        llenarShowModalAcciones: 0,
    }),
    actions: {
        crearModal(tipo_modal){
            this[tipo_modal] = true;
        },
        eliminarModal(tipo_modal){
            this[tipo_modal] = false;
        },
        numerarEstadoModal(tipo_modal, numero){ 
            this[tipo_modal] = numero;
        },
        createMsj(tipo_modal, message, option = 0){
            const modal = this[tipo_modal];
            modal.opt_1 = option === 1;
            modal.opt_2 = option === 2;
            modal.state = true;
            modal.message = message || '';
        },
        deleteMsj(tipo_modal){
            const modal = this[tipo_modal];
            Object.assign(modal, {
                state: false,
                message: '',
                opt_1: false,
                opt_2: false,
            });
        },
        createAlert (type, title, description, nameButton = 'Aceptar', width = '400px') {
            this.alertData = { type, title, description, nameButton, width };
            this.alerts = true;
        },
        closeAlert () {
            this.alerts = false;
            this.alertData = {
                type: 'success',
                title: '',
                description: '',
                width: '400px',
                nameButton: 'Aceptar',
            };
        },
        createActionModal (onConfirm = null, description = '') {
            this.actionModalData = { onConfirm, description };
            this.actionModal = true;
        },
        closeActionModal () {
            this.actionModal = false;
            this.actionModalData = {
                onConfirm: null,
                description: '',
            };
        }

    },
});