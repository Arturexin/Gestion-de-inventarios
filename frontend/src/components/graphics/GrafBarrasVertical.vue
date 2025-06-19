<script setup>
    import { ref, onMounted } from 'vue';
    import { cargarDatos } from '../../services/functionFetch';

    //states
    const personaMensual = ref([])
    //methods
    function graficoBarrasVerticalUnid(elemento, array_uno, array_dos, array_nombres){
        const ctx = elemento.getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: mes_anio,
                datasets: [{
                    label: array_nombres[0],
                    data: array_uno, 
                    backgroundColor: "rgb(99, 128, 230)",
                    borderColor: "rgb(99, 128, 230, 0.2)",
                    borderWidth: 1,
                    barThickness: 10  // Ajusta este valor para cambiar el grosor de las barras
                }, {
                    label: array_nombres[1],
                    data: array_dos, 
                    backgroundColor: "rgb(145, 230, 156)",
                    borderColor: "rgb(145, 230, 156, 0.2)",
                    borderWidth: 1,
                    barThickness: 10  // Ajusta este valor para cambiar el grosor de las barras
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        grid: {
                            display: false
                        },ticks: {
                            color: '#eee'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#eee'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#eee' // Establece el color de los labels en la leyenda
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let value = context.raw;
                                return `Unidades: ${value}`;
                            }
                        }
                    }
                }
            }
        });
    }

    async function graficoClientes(){
        personaMensual.value = await cargarDatos('clientes_mes?'+ `year_actual=${anio}`)

        //document.getElementById("contenedor_clientes_proveedores").innerHTML = `<canvas id="clientes_preveedores" class="gradico_anual"></canvas>`
        let array_clientes = [];
        let array_proveedores = [];

        for(let i = 0; i < 12; i++){
            array_clientes.push(0);
            array_proveedores.push(0);
            personaMensual.value.forEach((event)=>{
                if(event.mes == i + 1){
                    array_clientes[i] = Number(event.suma_clientes);
                    array_proveedores[i] = Number(event.suma_proveedores);
                };
            });
        };

        graficoBarrasVerticalUnid(document.getElementById("clientes_preveedores"), array_clientes, array_proveedores, ['Clientes', 'Proveedores'])
    };
    onMounted(() => {
        graficoClientes();
    });
</script>

<template>
    <div>
        <canvas id="clientes_preveedores" class="gradico_anual"></canvas>
    </div>
</template>

<style scoped>

</style>