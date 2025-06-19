<script setup>

</script>

<template>
    <td>
        <select v-model="devolucion.causa" class="input-general-importante fondo-importante">
            <option value="0" selected="">-- Causa de devolución --</option>                                    
            <option value= "1">Producto defectuoso</option>
            <option value= "2">Producto dañado durante el envío</option>
            <option value= "3">Producto incorrecto o equivocado</option>
            <option value= "4">Talla o ajuste incorrecto</option>
            <option value= "5">Insatisfacción con el producto</option>
            <option value= "6">Cambio por otro producto</option>
            <option value= "7">Cancelación del pedido</option>
            <option value= "8">Entrega retrasada</option>
        </select>
    </td>
</template>

<style scoped>

</style>