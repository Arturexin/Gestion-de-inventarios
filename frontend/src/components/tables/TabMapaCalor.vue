<script setup>
    import { defineProps, ref, onMounted, watch } from 'vue';
    import { useDataBases } from '../../stores/dataBases';


    const props = defineProps({
        titulo: {
            type: String,
            required: false
        },
        data_analisis: {
            type: Array,
            required: true
        },
        click_function:{
            type: Function,
            required: false
        },
        nombre:{
            type: String,
            required:true
        }
    })
    const dbStore = useDataBases()

    //states
    const objeto_analisis = ref({});
    const search_name = ref('');
    const select_value = ref(0);
    
    const options = [ 
                        {"value": 0, "name": "--Selección--", "item": ""}, 
                        {"value": 1, "name": "Ventas absolutas", "item": "suma_ventas"}, 
                        {"value": 2, "name": "Ventas relativas", "item": "suma_ventas"}, 
                        {"value": 3, "name": "Ganancias absolutas", "item": "suma_ganancias"}, 
                        {"value": 4, "name": "Ganancias relativas", "item": "suma_ganancias"}, 
                        {"value": 5, "name": "Unidades absolutas", "item": "suma_unidades"}, 
                        {"value": 6, "name": "Unidades relativas", "item": "suma_unidades"}, 
                        {"value": 7, "name": "Recurrencias absolutas", "item": "suma_veces"}, 
                        {"value": 8, "name": "Recurrencias relativas", "item": "suma_veces"}, 
                        {"value": 9, "name": "Devoluciones absolutas", "item": "suma_unidades_dev"}, 
                        {"value": 10, "name": "Devoluciones relativas", "item": "suma_unidades_dev"},
                    ]
    //methods

    class objeto_select {
        constructor(data_analisis, options){
            this.data_analisis = data_analisis;
            this.options = options;
            this.result = [];
            this.footer = {};
            this.modo = "";
        }
        data_absoluto(select_value){
            this.result = [];
            for(let i = 0; i < this.data_analisis.length; i++){
                if(this.data_analisis[i].nombre.toLowerCase().includes(search_name.value.toLowerCase()) ||
                search_name.value === ''){
                    let objeto = {
                        'id_sucursal':this.data_analisis[i].sucursal,
                        'id_categoria':this.data_analisis[i].categoria,
                        'nombre' : this.data_analisis[i].nombre,
                        'data_mensual' : this.data_analisis[i][this.options[select_value].item],
                    };
                    this.result.push(objeto);
                }
            };
            this.modo = select_value < 5 ? 1 : 2;
            return this.result;
        };
        data_relativo(select_value){
            let objeto_footer = this.suma_vertical(select_value)
            this.result = [];
            for(let i = 0; i < this.data_analisis.length; i++){
                let array_relativo = []
                this.data_analisis[i][this.options[select_value].item].forEach((e, j)=>{
                    array_relativo.push(!isNaN(e/objeto_footer.array_[j]) ? (e/objeto_footer.array_[j])*100: 0)
                })
                let objeto = {
                    'id_sucursal':this.data_analisis[i].sucursal,
                    'id_categoria':this.data_analisis[i].categoria,
                    'nombre' : this.data_analisis[i].nombre,
                    'data_mensual' : array_relativo,
                };
                this.result.push(objeto);
            };
            this.modo = 3;
            return this.result;
        };
        suma_horizontal(){
            let total = 0;
            this.result.forEach((e)=>{
                let suma = 0;
                e.data_mensual.forEach((event)=>{
                    suma += event;
                    total += event
                })
                e.suma_anio = suma;
            });
            return total;
        };
        suma_horizontal_relativo(){
            let total = this.suma_horizontal()
            this.result.forEach((e)=>{
                let suma = 0;
                e.data_mensual.forEach((event)=>{
                    suma += event;
                })
                e.suma_anio = (suma/total) * 100;
            });
        };
        suma_vertical(select_value){
            this.footer = {
                'array_': [],
                'total_suma': 0,
                'mayor_absoluto':0,
            }
            for(let i = 0; i < 12; i++){
                let suma = 0;
                this.data_analisis.forEach((e)=>{
                    suma += e[this.options[select_value].item][i]
                    if(this.footer.mayor_absoluto < e[this.options[select_value].item][i]){
                        this.footer.mayor_absoluto = e[this.options[select_value].item][i];
                    };
                });
                this.footer.array_.push(suma);
                this.footer.total_suma += suma;
            };
            return this.footer;
        }
        suma_vertical_relativo(select_value){
            this.footer = {
                'array_': [],
                'total_suma': 100,
                'mayor_absoluto':0,
            }
            let array_mensual = []
            let total = 0
            for(let i = 0; i < 12; i++){
                let suma = 0;
                this.data_analisis.forEach((e)=>{
                    suma += e[this.options[select_value].item][i]
                });
                array_mensual.push(suma);
                total += suma;
            };
            for(let i = 0; i < 12; i++){
                this.data_analisis.forEach((e)=>{
                    if(this.footer.mayor_absoluto < (e[this.options[select_value].item][i]/array_mensual[i]) * 100){
                        this.footer.mayor_absoluto = (e[this.options[select_value].item][i]/array_mensual[i]) * 100;
                    };
                });
                this.footer.array_.push((array_mensual[i]/total) * 100);
            };
            return this.footer;
        }

    };
    function eventoSelect(){
        if(Number(select_value.value) === 0){
            objeto_analisis.value.result = []
            objeto_analisis.value.footer = {}
            objeto_analisis.value.modo = 0;
        }else if(Number(select_value.value) % 2 !== 0){
            objeto_analisis.value.data_absoluto(select_value.value);
            objeto_analisis.value.suma_horizontal();
            objeto_analisis.value.suma_vertical(select_value.value);
        }else if(Number(select_value.value) % 2 === 0){
            objeto_analisis.value.data_relativo(select_value.value)
            objeto_analisis.value.suma_horizontal_relativo()
            objeto_analisis.value.suma_vertical_relativo(select_value.value);
        }
    }

    onMounted(()=>{
        objeto_analisis.value = new objeto_select(props.data_analisis, options)
    })
</script>

<template>
    <div>
        <table class="tabla_mapa_calor">
            <thead>
                <tr>
                    <th scope="row" colspan="16"><h2><span>{{ props.titulo }}</span></h2></th>
                </tr>
                <tr>
                    <th scope="row" colspan="16">
                        <select class="input-select-ventas" v-model="select_value" @change="eventoSelect">
                            <option v-for="e in options" :value="e.value">{{ e.name }}</option>
                        </select>
                    </th>
                </tr>
                <tr>
                    <th style="display:grid; justify-items:center; width:100px;">{{ props.nombre }}</th>
                    <th>Ene</th>
                    <th>Feb</th>
                    <th>Mar</th>
                    <th>Abr</th>
                    <th>May</th>
                    <th>Jun</th>
                    <th>Jul</th>
                    <th>Ago</th>
                    <th>Set</th>
                    <th>Oct</th>
                    <th>Nov</th>
                    <th>Dic</th>
                    <th>Total</th>
                    <th>Detalle</th>
                </tr>
            </thead>
            <tbody style="font-size: 15px;">
                <tr v-for="event in objeto_analisis.result">
                    <td style="width: 100px;">{{ event.nombre }}</td>
                    <td 
                        v-for="e in event.data_mensual"
                        :style="{ background: dbStore.colorFondo(objeto_analisis.footer.mayor_absoluto, e) }"
                        style="text-align: center; color: #eee;width: 80px;font-size: 13px;"
                    >
                        {{ objeto_analisis.modo === 1 ? 'S/ ' + e.toFixed(2) : objeto_analisis.modo === 2 ? e.toFixed(0) : e.toFixed(0) + "%" }}
                    </td>
                    <td style="text-align: center; width: 80px;font-size: 13px; font-weight: bold; border: 2px solid var(--suc-uno)">
                        {{ objeto_analisis.modo === 1 ? 'S/ ' + event.suma_anio.toFixed(2) : objeto_analisis.modo === 2 ? event.suma_anio.toFixed(0) : event.suma_anio.toFixed(0) + "%" }}
                    </td>
                    <td style="text-align: center;width: 40px;">
                        <slot name="actions" :dato="event"></slot>
                    </td>
                    
                </tr>
            </tbody>
            <tfoot>
                <tr v-if="objeto_analisis.footer">
                    <th>Total</th>
                    <th style="text-align: center;font-size: 13px; border: 2px solid var(--suc-uno); font-weight: bold;" v-for="event in objeto_analisis.footer.array_">
                        {{ objeto_analisis.modo === 1 ? 'S/ ' + event.toFixed(2) : objeto_analisis.modo === 2 ? event.toFixed(0) : event.toFixed(0) + "%" }}
                    </th>
                    <th style="text-align: center;font-size: 13px;">
                        {{ objeto_analisis.modo === 1 ? 'S/ ' + objeto_analisis.footer.total_suma.toFixed(2) : objeto_analisis.modo === 2 ? objeto_analisis.footer.total_suma.toFixed(0) : objeto_analisis.footer.total_suma + "%" }}
                    </th>
                    <th><button id="imprimir_cat">Imprimir</button></th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style scoped>
.tabla_mapa_calor{
    width: 1100px;
    
    background: linear-gradient(45deg, var(--fondo-primero), var(--fondo-quinto));
    padding: 10px;
}

.tabla_mapa_calor tbody tr:hover {
    background-color: var(--fondo-cuarto);
}
</style>