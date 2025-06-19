import { defineStore } from 'pinia'
import { cargarDatos } from '../services/functionFetch'

export const useDataBases = defineStore('db', {
    state: () => ({
        db_productos: [],
        db_buscar_productos: {},
        db_clientes: [],
        db_proveedores: [],
        db_sucursales: [],
        db_negocio: [],
        db_usuario: [],
        db_categorias: [],
        _sucursales_nombre: [
                                { name: "Almacén Central", stock: "existencias_ac", color_b: "var(--suc-b-uno)", operacion: "q_ac", color_a: "var(--suc-uno)" },
                                { name: "Sucursal Uno", stock: "existencias_su", color_b: "var(--suc-b-dos)", operacion: "q_su", color_a: "var(--suc-dos)" },
                                { name: "Sucursal Dos", stock: "existencias_sd", color_b: "var(--suc-b-tres)", operacion: "q_sd", color_a: "var(--suc-tres)" },
                                { name: "Sucursal Tres", stock: "existencias_st", color_b: "var(--suc-b-cuatro)", operacion: "q_st", color_a: "var(--suc-cuatro)" },
                                { name: "Sucursal Cuatro", stock: "existencias_sc", color_b: "var(--suc-b-cinco)", operacion: "q_sc", color_a: "var(--suc-cinco)" },
                            ],
        array_com_tra: [], // Array para almacenar las compras en Inventarios
        array_dev: [], // Array para almacenar las devoluciones en Entradas y Salidas
        array_creditos: [], // Array para almacenar los créditos en Créditos
        v_:{
            array_venta: [
                { id_sucursal: 0, suc: [], comprobante: '' },
                []
            ], // Array para almacenar las ventas en Ventas
            objeto_credito: {
                sucursal_cre: 0,
                tipo_comprobante: '',
                tasa: 0,
                saldo_monto: 0,
                saldo_interes: 0,
                saldo_total: 0,
                fecha_cre: '',
            }, // Objeto para almacenar los créditos en Créditos
            objeto_modo_pago: {
                modo_efectivo: 0,
                modo_credito: 0,
                modo_tarjeta: 0,
                modo_perdida: 0,
                canal_venta: 0,
            }, // Objeto para almacenar los modos de pago en Ventas
            check_ticket_venta: false, // Variable para habilitar el ticket de venta en Ventas
            check_canal_venta: false, // Variable para habilitar el canal de venta en Ventas
            id_cliente_ventas:0,
            cod_ventas: '',
        },
        c_:{
            array_init: [], // Array para almacenar las compras en Compras
            array_compras: [], // Array para almacenar las compras en Compras
        },
        r_:{
            cod_ref: {}, // Array para almacenar las referencias en Recompras
            cod_search: {}, // Array para almacenar las referencias en Recompras
            array_init: [], // Array para almacenar las compras en Compras
            array_recompras: [], // Array para almacenar las compras en Compras
        },

        recarga_tabla: false,
        mapa_calor : [
                        'rgba(145, 255, 133, 0.6)', // #91ff85
                        'rgba(198, 245, 86, 0.6)',  // #C6F556
                        'rgba(245, 207, 111, 0.6)', // #F5CF6F
                        'rgba(222, 139, 89, 0.6)',  // #DE8B59
                        'rgba(255, 102, 109, 0.6)'  // #FF666D
                    ]
    }),
    actions: {
        async cargarProductosBuscar() {
            let datos = await cargarDatos(`almacen_central_ccd`);
            let grupos = {};
            
            datos.forEach(producto => {
                // Obtener el primer carácter del código en mayúscula
                let primerCaracter = producto.codigo[0].toUpperCase();
                
                // Si el grupo no existe, se crea un nuevo array para ese carácter
                if (!grupos[primerCaracter]) {
                    grupos[primerCaracter] = [];
                }
                
                // Agregar el producto al grupo correspondiente
                grupos[primerCaracter].push(producto);
            });
            this.db_buscar_productos = grupos;
            /* console.log(this.db_buscar_productos) */
        },
        async crearDataBase(db, ruta) {
            this[db] = await cargarDatos(ruta);
        },
        async agregarDatoADataBase(db, objeto_data) {
            this[db].push(objeto_data);
            /* console.log(this.db_clientes) */
        },
        async eliminarDatoADataBase(db, id_objeto, id_dato) {
            const index = this[db].findIndex(cliente => cliente[id_objeto] === id_dato);
            if (index !== -1) {
                this[db].splice(index, 1);
                console.log(`Dato con ID ${id_dato} eliminado`);
            } else {
                console.log(`Dato con ID ${id_dato} no encontrado`);
            }
        },
        habilitarRecarga(dato){
            this[dato] = true;
        },
        deshabilitarRecarga(dato){
            this[dato] = false;
        },
        CS(nombre_sucursal){
            let index = this._sucursales_nombre.findIndex(el => el.name === nombre_sucursal)
            if (index === -1) {
                /* console.error(`Sucursal ${nombre_sucursal} no encontrada`); */
                return null;
            };
            return this._sucursales_nombre[index].color_b;
        },
        colorFondo(mayor_absoluto, num) {
            if(num > 0){
                if (num <= mayor_absoluto * 0.20) {  // Determinamos el color de las celdas según su valor numérico
                    return this.mapa_calor[4];
                } else if (num <= mayor_absoluto * 0.40) {
                    return this.mapa_calor[3];
                } else if (num <= mayor_absoluto * 0.60) {
                    return this.mapa_calor[2];
                } else if (num <= mayor_absoluto * 0.80) {
                    return this.mapa_calor[1];
                } else if (num <= mayor_absoluto) {  // No es necesario multiplicar por 1
                    return this.mapa_calor[0];
                }
            }
            return '';  // Por si acaso ninguno de los casos se cumple
        },
        busquedaDinamica(texto) {
            if(texto !== ""){
    
                let textoBuscado = texto.toLowerCase();
                let primerCaracter = textoBuscado[0].toUpperCase();
                
                // Buscar en el grupo correspondiente si existe
                if (!this.db_buscar_productos[primerCaracter]) {
                    return undefined; // Si no existe el grupo, no hay resultados
                }
                
                // Filtrar los productos en el grupo seleccionado
                return this.db_buscar_productos[primerCaracter].find(y => y.codigo.toLowerCase().startsWith(texto.toLowerCase()))
                return productosPorGrupo[primerCaracter].filter(y => y.codigo.toLowerCase().startsWith(textoBuscado));
            }
        },
        categoriaTallas(categoria){
            let array = [];
            const event = categoria;
            let cat = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce']
            let cat_id = this.db_categorias.find(x=> x.id === Number(event))
            if(cat_id){
                cat.forEach((e)=>{
                    cat_id[e] !== "" ? array.push(cat_id[e]): "";
                })
            };
            return array;
        },
        val_exs_(obj, i){
            return [
                this[obj].array_init[i].q_ac, 
                this[obj].array_init[i].q_su, 
                this[obj].array_init[i].q_sd, 
                this[obj].array_init[i].q_st, 
                this[obj].array_init[i].q_sc, 
            ]
        },
        val_positivo(obj, i){
            return [
                this[obj].array_init[i].existencias_ac + this[obj].array_init[i].q_ac,
                this[obj].array_init[i].existencias_su + this[obj].array_init[i].q_su,
                this[obj].array_init[i].existencias_sd + this[obj].array_init[i].q_sd,
                this[obj].array_init[i].existencias_st + this[obj].array_init[i].q_st,
                this[obj].array_init[i].existencias_sc + this[obj].array_init[i].q_sc,
            ]
        },
    }
});
