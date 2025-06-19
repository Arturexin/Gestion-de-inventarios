<script setup>
  import { onMounted } from 'vue';
  import { RouterView } from 'vue-router';
  import SideBar from './components/SideBar.vue';
  import NavBar from './components/NavBar.vue';
  import { useDataBases } from './stores/dataBases';

  //states
  const dataBases = useDataBases();

  onMounted(async () => {
    await dataBases.cargarProductosBuscar()
    await dataBases.crearDataBase('db_productos', 'almacen_central_ccd')
    await dataBases.crearDataBase('db_clientes', 'clientes_db')
    await dataBases.crearDataBase('db_proveedores', 'proveedores_db')
    await dataBases.crearDataBase('db_sucursales', 'sucursales_db')
    await dataBases.crearDataBase('db_categorias', 'categorias_db')
    await dataBases.crearDataBase('db_negocio', 'negocio_db')
    await dataBases.crearDataBase('db_usuario', 'usuario_db/9')
    /* console.log(dataBases.db_buscar_productos) */
    /* console.log('Bases de datos creadas') */
  });
  

</script>

<template>
  <div>
    <div class="cuerpo">
      <SideBar />
      <div class="content">
        <div>
          <NavBar />
        </div>
        <div class="escritorio">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cuerpo {
  display: flex;
  /* justify-content: center; */
  justify-content: flex-start;
  /* margin: 0 5%; */
}
.content {
  background: rgb(32 35 36);
  width: 80%;
}
.escritorio {
  display: grid;
  gap: 1em;
  padding: 10px;
  max-height: 90vh; /* Ajusta la altura máxima según tus necesidades */
  overflow-y: auto; /* Agrega scroll vertical */
}

</style>
