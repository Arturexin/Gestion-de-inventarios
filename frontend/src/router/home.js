import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import BlogView from '../views/BlogView.vue'
import EntradaBlogView from '../views/EntradaBlogView.vue'
import SearchView from '../views/SearchView.vue'
import NotFoundView from '../views/NotFoundView.vue'

export const homeRoutes = [
    { path: '/:pathMatch(.*)*', component: NotFoundView },
    
    { path: '/', component: HomeView, name: 'home'},
    { path: '/about', component: AboutView, name: 'about'},
    { path: '/blog', component: BlogView, name: 'blog',
        children: [
            { path: 'detail/:id(\\d+)', component: EntradaBlogView, name: 'blog-detail'},
        ]
    },
    { path: '/entrada/:id(\\d+)', component: EntradaBlogView, name: 'blog-entrada'},
    { path: '/search-blog', component: SearchView, name: 'search-blog'},
]