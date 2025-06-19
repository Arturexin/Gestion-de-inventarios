import LoginView from "../views/users/LoginView.vue";
import PerfilUserView from "../views/users/PerfilUserView.vue";


export const usersRoutes = [
  { path: '/login', component: LoginView, name: 'login'},
  { path: '/user-perfil', 
    component: PerfilUserView, 
    name: 'user-perfil',
    meta: { 
      secure: true 
    }
  },
]