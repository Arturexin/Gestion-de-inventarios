import { createRouter, createWebHistory } from 'vue-router'

import { homeRoutes } from './home.js'
import { usersRoutes } from './users.js'
import { itemsRoutes } from './items.js'


const routes = [
    ...homeRoutes,  
    ...usersRoutes,
    ...itemsRoutes,
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})
router.beforeEach((to, from) => {
    let auth = localStorage.getItem('isAuth') === 'true'
    if(to.meta.secure && !auth){
        console.log('Es una ruta protegida, y usuario no logeado.')
        return {
            path: '/login',
        }
    }
    console.log('Navegando a:', to.fullPath)
})
export default router