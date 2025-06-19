import { defineStore } from "pinia";

export const useModalStore = defineStore('modal', {
    state: () => ({
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
        }
    },
});