<script setup>
  import { defineProps } from 'vue';
    import '../../styles/tabPr.css'
  const props = defineProps({
    titulo:{
        type: String,
        required: true
    }
  })
</script>

<template>
  <div> 
    <table id="tabla_principal" class="tabla-proforma">
        <thead>
            <tr>
                <th scope="row" colspan="12"><h2>{{ props.titulo }}</h2></th>
            </tr>
            <tr>
                <th style="width: 130px;">Categoría</th>
                <th style="width: 150px;">Código</th>
                <th style="width: 250px;">Descripción</th>
                <th style="width: 70px; background: var(--suc-uno)">Q AC</th>
                <th style="width: 70px; background: var(--suc-dos)">Q SU</th>
                <th style="width: 70px; background: var(--suc-tres)">Q SD</th>
                <th style="width: 70px; background: var(--suc-cuatro)">Q ST</th>
                <th style="width: 70px; background: var(--suc-cinco)">Q SC</th>
                <th style="width: 70px;">Costo</th>
                <th style="width: 70px;">Costo total</th>
                <th style="width: 120px;">Motivo de salida</th>
                <th id="remover-tabla-despacho-dos" class="eliminarTablaFila">
                    <div class="btnDosB">
                        <span style="font-size:18px;" class="material-symbols-outlined">delete</span>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
        </tbody>
        <tfoot>
            <tr>
                <th scope="row" colspan="3">Total unidades despachadas</th>
                <th class="t_e_1">0</th>
                <th class="t_e_2">0</th>
                <th class="t_e_3">0</th>
                <th class="t_e_4">0</th>
                <th class="t_e_5">0</th>
                <th scope="row" colspan="5">
                    <label style="margin: 0 5px;" class="label-checkbox">Imprimir lista de despacho
                        <input type="checkbox" id="check_comprobante">
                    </label>
                </th>
            </tr>
            <tr>
                <th scope="row" colspan="12">
                    <button id="procesar-despacho-plus" class="btnTres">Procesar</button>
                </th>
            </tr>
        </tfoot>
    </table>
  </div>
</template>

<style scoped>

</style>