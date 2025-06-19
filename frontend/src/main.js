import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/style.css'
import './styles/btn.css'
import App from './App.vue'
import router from './router'
//routes
const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
