<script setup>
    import { ref, defineProps, watch } from 'vue'
    import { expReg } from '../../services/expReg'
    import { useDataBases } from '../../stores/dataBases';
    import { useModalStore } from '../../stores/modalStore';
    import { enviarDatos, generarFecha } from '../../services/functionFetch';

    const dbStore = useDataBases();
    const modalStore = useModalStore();

    //states
    const clase_cli = ref(0)
    const txtId = ref('')
    const nombre = ref('')
    const dni = ref('')
    const email = ref('')
    const telefono = ref('')
    const direccion = ref('')
    const input_buscar = ref('')
    const select_opcion = ref('1')
    //props
    const props = defineProps({//Aqui recibimos los datos de la fila de la tabla
        title: {
            type: String,
            required: true
        },
        cliente: {
            type: Object,
            default: null
        },
        select: {
            type: Boolean,
            default: false,
            required: true
        },
        button: {
            type: Boolean,
            default: false,
            required: true
        },
        button_dos: {
            type: Boolean,
            default: false,
            required: true
        }
    })
    watch(() => props.cliente, (newVal) => {//Con esto rellenamos el formulario
        if (newVal) {
            clase_cli.value = newVal.clase_cli;
            txtId.value = newVal.id_cli;
            nombre.value = newVal.nombre_cli;
            dni.value = newVal.dni_cli;
            email.value = newVal.email_cli;
            telefono.value = newVal.telefono_cli;
            direccion.value = newVal.direccion_cli;
        }
    });
    function expNombre(e){
        expReg.cliente.test(e.value) ? e.style.background = "":
                                    e.style.background = "var(--boton-dos)"
    }
    function expDni(e){
        expReg.dni.test(e.value) ?    e.style.background = "":
                                                e.style.background = "var(--boton-dos)"
    }
    function expEmail(e){
        expReg.email.test(e.value) ?    e.style.background = "":
                                            e.style.background = "var(--boton-dos)"
    }
    function expTelefono(e){
        expReg.telefono.test(e.value) ?    e.style.background = "":
                                            e.style.background = "var(--boton-dos)"
    }
    function expDireccion(e){
        expReg.direccion.test(e.value) ?   e.style.background = "":
                                            e.style.background = "var(--boton-dos)"
    }
    function reseteoFormulario(){
        txtId.value = '';
        clase_cli.value = '0';
        nombre.value = '';
        dni.value = '';
        email.value = '';
        telefono.value = '';
        direccion.value = '';

        // Restablecer el color de fondo de los campos
        document.getElementById('txtId').style.background = '';
        document.getElementById('clase_cli') ? document.getElementById('clase_cli').style.background = '' : '';
        /* document.getElementById('clase_cli').style.background = ''; */
        document.getElementById('nombre').style.background = '';
        document.getElementById('dni').style.background = '';
        document.getElementById('email').style.background = '';
        document.getElementById('telefono').style.background = '';
        document.getElementById('direccion').style.background = '';

        document.getElementById('clase_cli') ? document.getElementById('clase_cli').focus() : '';
        dbStore.v_.id_cliente_ventas = 0;
    };

    async function ingresarPersona(){
        const encontrado = dbStore.db_clientes.find(y => y.nombre_cli.toLowerCase().startsWith(nombre.value.toLowerCase()) && 
                                            y.telefono_cli.toLowerCase().startsWith(telefono.value.toLowerCase()))
        
        if(encontrado === undefined){
            if(expReg.cliente.test(nombre.value) &&
            expReg.telefono.test(telefono.value) &&
            expReg.direccion.test(direccion.value)){
                let dataS = {
                    "clase_cli": clase_cli.value,
                    "direccion_cli": direccion.value,
                    "dni_cli": dni.value,
                    "email_cli": email.value,
                    "nombre_cli": nombre.value,
                    "telefono_cli": telefono.value,
                    "fecha_cli": generarFecha()
                };
                let id = txtId.value
                if (id != '') {
                    dataS.id_cli = id
                };

                let ruta = 'clientes';
                let response = await enviarDatos(ruta, dataS);
                if(response.status === "success"){
                    dataS.id_cli = response.id; // Agregar la propiedad id_cli con el valor response.id
                    reseteoFormulario()
                    txtId.value = "";
                    document.getElementById("nombre").focus();
                    if(clase_cli.value > 0){
                        dbStore.agregarDatoADataBase('db_proveedores', dataS); // Actualizamos el estado global
                    }else{
                        dbStore.agregarDatoADataBase('db_clientes', dataS); // Actualizamos el estado global
                    };
                    dbStore.v_.id_cliente_ventas = response.id;
                };
            }else if(expReg.cliente.test(nombre.value) == false){
                document.getElementById("nombre").style.background = "#b36659"
                modalStore.createMsj(   'showModalMsj', 
                                        `Ingrese un nombre de cliente correcto.`,
                                        2);
            }else if(expReg.telefono.test(telefono.value) == false){
                document.getElementById("telefono").style.background = "#b36659"
                modalStore.createMsj(   'showModalMsj', 
                                        `Ingrese un número de teléfono o celular.`,
                                        2);
            }else if(expReg.direccion.test(direccion.value) == false){
                document.getElementById("direccion").style.background = "#b36659"
                modalStore.createMsj(   'showModalMsj', 
                                        `Ingrese una dirección.`,
                                        2);
            };
        }else{
            modalStore.createMsj(   'showModalMsj', 
                                    `El cliente/proveedor ${nombre.value} con numero de teléfono `+
                                    `${telefono.value} ya se encunetra registrado.`,
                                    2);
        };
    };

    async function llenarFormVentas(cliente){// Función que busca clientes registrados
        txtId.value = cliente.id_cli;
        nombre.value = cliente.nombre_cli;
        dni.value = cliente.dni_cli;
        email.value = cliente.email_cli;
        telefono.value = cliente.telefono_cli;
        direccion.value = cliente.direccion_cli;
        dbStore.v_.id_cliente_ventas = cliente.id_cli;
    };
    function BusquedaCliente(){
        let array_dato_cliente = ["nombre_cli", "dni_cli", "email_cli", "telefono_cli"];
        let dato_cliente = dbStore.db_clientes.find(y => y[array_dato_cliente[Number(select_opcion.value) - 1]].toLowerCase().includes(input_buscar.value.toLowerCase()))
        if(dato_cliente !== undefined){
            llenarFormVentas(dato_cliente)
            modalStore.createMsj(   'showModalMsj', 
                                    `Cliente encontrado.`,
                                    2);
        }else{
            modalStore.createMsj(   'showModalMsj', 
                                    `Cliente no encontrado.`,
                                    2);
            reseteoFormulario();
        };
    };
    
</script>

<template>
    <div>
        <h2 style="text-align: center;">{{ props.title }}</h2>
        
        <div style="display: flex; gap: 110px;">
            <form id="formClientes" class="into_form">
                    <div v-if="props.select">
                        <label class="label-general">Persona
                            <select class="input-general fondo-input" v-model="clase_cli" id="clase_cli" style="cursor: pointer;">
                                <option value="0">Cliente</option>
                                <option value="1">Proveedor</option>
                            </select>
                            <div class="tooltip_ayuda">
                                <span class="material-symbols-outlined">help</span>
                                <span class="tooltiptext_ayuda">Seleccione el tipo de persona que ingresará.</span>
                            </div>
                        </label>
                    </div>
                    <div>
                        <input v-model="txtId" id="txtId" type="hidden" placeholder="ID" />
                        <label class="label-general">
                            <div style="display: flex">Nombres*
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">El nombre de la persona solo puede contener como caracteres letras.</span>
                                </div>
                            </div>
                            <input class="input-general fondo-input" type="text" v-model="nombre" @input="expNombre($event.target)" id="nombre" name="nombre" placeholder="Nombre"/>
                        </label>
                        <label class="label-general">
                            <div style="display: flex">DNI/RUC
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">El DNI/RUC solo puede contener caracteres numéricos.</span>
                                </div>
                            </div>
                            <input class="input-general fondo-input" type="text" v-model="dni" @input="expDni($event.target)" id="dni" name="dni" placeholder="DNI" />
                        </label>
                        <label class="label-general">
                            <div style="display: flex">Email
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">Ingresar datos en formato adecuado. Ej.: "email@karpovick.com".</span>
                                </div>
                            </div>
                            <input class="input-general fondo-input" type="text" v-model="email" @input="expEmail($event.target)" id="email" name="email" placeholder="Email" />
                        </label>
                        <label class="label-general">
                            <div style="display: flex">Teléfono
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">Ingresar datos en formato adecuado. EJ: "999 999 999".</span>
                                </div>
                            </div>
                            <input class="input-general fondo-input" type="text" v-model="telefono" @input="expTelefono($event.target)" id="telefono" name="telefono" placeholder="Telefono" />
                        </label>
                        <label class="label-general">
                            <div style="display: flex">Dirección
                                <div class="tooltip_ayuda">
                                    <span class="material-symbols-outlined">help</span>
                                    <span class="tooltiptext_ayuda">Ingresar la dirección de residencia.</span>
                                </div>
                            </div>
                            <input class="input-general fondo-input" type="text" v-model="direccion" @input="expDireccion($event.target)" id="direccion" name="direccion" placeholder="Dirección" />
                        </label>
                        
                    </div>
                    <div class="contenedor-botones" v-if="props.button">
                        <button @click.prevent="ingresarPersona()" class="btnUno">Registrar Cliente</button>
                        <button @click.prevent="reseteoFormulario()" class="btnDos">Restablecer</button>
                    </div>
            </form>
            <div v-if="props.button_dos" style="display: grid; align-items: center; padding: 10px 10px;">
                <div>
                    <select v-model="select_opcion" class="input-select-ventas">
                        <option value="1">Nombres</option>
                        <option value="2">DNI</option>
                        <option value="3">Email</option>
                        <option value="4">Teléfono</option>
                    </select>
                </div>
                <div style="display: grid;">
    
                    <input class="input-general fondo-input" style="width: 247.88px;" type="text" v-model="input_buscar" placeholder="Buscar por palabras clave ...">
                    <div class="tooltip_ayuda ">
                        <button @click="BusquedaCliente" class="btnUnoB" style="width: 260px;">Buscar</button>
                        <span class="tooltiptext_ayuda">Buscar consumos.</span>
                    </div>
                </div>
                <button @click.prevent="ingresarPersona()" class="btnUnoB">Registrar Cliente</button>
                <button @click.prevent="reseteoFormulario()" class="btnDosB">Restablecer</button>
    
            </div>
        </div>
    </div>

</template>

<style scoped>
.contenedor-botones{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 400px;
}
.into_form{
    display: grid;
    justify-items: center;
    gap: 1em;
    /* width: 550px; */
    padding: 10px 0;
}
</style>