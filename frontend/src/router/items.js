import ComprasView from '../views/items/ComprasView.vue'
import InicioView from '../views/items/InicioView.vue'
import VentasView from '../views/items/VentasView.vue'
import TransferenciasView from '../views/items/TransferenciasView.vue'
import ModificacionesView from '../views/items/ModificacionesView.vue'
import DespachosView from '../views/items/DespachosView.vue'
import KardexView from '../views/items/KardexView.vue'
import DevolucionesView from '../views/items/DevolucionesView.vue'
import DetalleView from '../views/items/DetalleView.vue'
import InventarioView from '../views/items/InventarioView.vue'
import EntradasView from '../views/items/EntradasView.vue'
import SalidasView from '../views/items/SalidasView.vue'
import ClientesView from '../views/items/ClientesView.vue'  
import ConfiguracionView from '../views/items/ConfiguracionView.vue'
import AnalisisView from '../views/items/AnalisisView.vue'

export const itemsRoutes = [
    { path: '/inicio', component: InicioView, name: 'inicio-item'},
    { path: '/ventas', component: VentasView, name: 'ventas-item'},
    { path: '/compras', component: ComprasView, name: 'compras-item'},
    { path: '/transferencias', component: TransferenciasView, name: 'transferencias-item'},
    { path: '/modificaciones', component: ModificacionesView, name: 'modificaciones-item'},
    { path: '/despachos', component: DespachosView, name: 'despachos-item'},
    { path: '/kardex', component: KardexView, name: 'kardex-item'},
    { path: '/devoluciones', component: DevolucionesView, name: 'devoluciones-item'},   
    { path: '/detalle', component: DetalleView, name: 'detalle-item'},
    { path: '/inventario', component: InventarioView, name: 'inventario-item'},
    { path: '/entradas', component: EntradasView, name: 'entradas-item'},   
    { path: '/salidas', component: SalidasView, name: 'salidas-item'},
    { path: '/clientes', component: ClientesView, name: 'clientes-item'},
    { path: '/configuracion', component: ConfiguracionView, name: 'configuracion-item'},
    { path: '/analisis', component: AnalisisView, name: 'analisis-item'}

]