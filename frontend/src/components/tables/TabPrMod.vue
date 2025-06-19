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
                <th>Categoría</th>
                <th>Código</th>
                <th>Descripción</th>
                <th>Medidas</th>
                <th>Costo Unitario</th>
                <th>Precio de Venta</th>
                <th>Lote</th>
                <th>Proveedor</th>
                <th id="remover-tabla-modificacion-dos" class="eliminarTablaFila">
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

            <th scope="row" colspan="12">
              <button id="procesar-registro" class="btnTres">Procesar</button>
            </th>
          </tr>
        </tfoot>
    </table>
  </div>
</template>

<style scoped>

</style>