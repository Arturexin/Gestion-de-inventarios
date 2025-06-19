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
                <th scope="row" colspan="11"><h2>{{ props.titulo }}</h2></th>
            </tr>
            <tr>
                <th>Código Origen</th>
                <th>Descripción	</th>
                <th style="background: var(--suc-uno)">Unidades a transferir AC</th>
                <th style="background: var(--suc-dos)">Unidades a transferir SU</th>
                <th style="background: var(--suc-tres)">Unidades a transferir SD</th>
                <th style="background: var(--suc-cuatro)">Unidades a transferir ST</th>
                <th style="background: var(--suc-cinco)">Unidades a transferir SC</th>
                <th id="remover-tabla-transferencias-dos" class="eliminarTablaFila">
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
                <th scope="row" colspan="4">Total Unidades Transferidas</th>
                <th scope="row" colspan="5">
                    <label style="margin: 0 5px;" class="label-checkbox">Imprimir lista de transferencias
                        <input type="checkbox" id="check_comprobante">
                    </label>
                </th>
            </tr>
            <tr>
                <th scope="row" colspan="9">
                    <button id="procesar-transferencias-plus" class="btnTres">Procesar</button>
                </th>
            </tr>
        </tfoot>
    </table>
  </div>
</template>

<style scoped>

</style>