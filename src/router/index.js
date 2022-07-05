import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      requiresAuth: true
    },
    // component: HomeView
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/registrar-paciente',
    name: 'registrar-paciente',
    component: () => import(/* webpackChunkName: "about" */ '../views/RegistrarPaciente.vue')
  },
  {
    path: '/pruebas',
    name: 'pruebas',
    component: () => import(/* webpackChunkName: "about" */ '../views/Pruebas.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue')
  },
  {
    path:'/fotos/:id',
    name:'fotos',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Fotos.vue'),
    
  },
  {
    path:'/pacientes',
    name:'paciente',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Pacientes.vue'),
    
  },
  {
    path:'/personal',
    name:'personal',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Personal.vue'), 
  },
  {
    path:'/roles',
    name:'roles',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Roles.vue'),
    
  },
  {
    path:'/especialidades',
    name:'especialidades',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Especialidades.vue'),  
  },
  {
    path:'/catalogos',
    name:'catalogos',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Catalogos.vue'),  
  },
  {
    path:'/examenes',
    name:'examenes',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Examenes.vue'),  
  },
  {
    path:'/medicamentos',
    name:'medicamentos',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Medicamentos.vue'),  
  },
  {
    path:'/citas',
    name:'citas',
    meta: {requiresAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Citas.vue'),  
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) =>{
  const rutaProtegida  = to.meta.requiresAuth;
  console.log(to.name);
  console.log(store.state.roles);
  console.log(store.state.token)
  if (rutaProtegida && store.state.token === null) {
    next('/login')
  }else {
    next()
  }
})
export default router
