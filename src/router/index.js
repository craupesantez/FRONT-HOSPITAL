import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    // component: HomeView
    meta: { 
      requiresAuth: false,
      title: 'home' },
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
    meta: { 
      requiresAuth: false,
      title: 'Login' },
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/registrar-paciente',
    name: 'registrar-paciente',
    meta: { 
      requiresAuth: false,
      title: 'Registro de Paciente' },
    component: () => import(/* webpackChunkName: "registrar-paciente" */ '../views/RegistrarPaciente.vue')
  },
  {
    path: '/pruebas',
    name: 'pruebas',
    component: () => import(/* webpackChunkName: "pruebas" */ '../views/Pruebas.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  },
  {
    path: '/fotos/:id',
    name: 'fotos',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "fotos" */ '../views/Fotos.vue'),

  },
  {
    path: '/pacientes',
    name: 'pacientes',
    meta: { 
      requiresAuth: true,
      title: 'Pacientes'
     },
    component: () => import(/* webpackChunkName: "pacientes" */ '../views/Pacientes.vue'),

  },
  {
    path: '/personal',
    name: 'personal',
    meta: { 
      requiresAuth: true,
      title:'Personal'
     },
    component: () => import(/* webpackChunkName: "personal" */ '../views/Personal.vue'),
  },
  {
    path: '/roles',
    name: 'roles',
    meta: { 
      requiresAuth: true,
      title:'Roles'
     },
    component: () => import(/* webpackChunkName: "roles" */ '../views/Roles.vue'),

  },
  {
    path: '/especialidades',
    name: 'especialidades',
    meta: { 
      requiresAuth: true,
      title:'Especialidades'
     },
    component: () => import(/* webpackChunkName: "especialidades" */ '../views/Especialidades.vue'),
  },
  {
    path: '/catalogos',
    name: 'catalogos',
    meta:{ 
      requiresAuth: true,
      title:'Catalogos'
     },
    component: () => import(/* webpackChunkName: "catalogos" */ '../views/Catalogos.vue'),
  },
  {
    path: '/examenes',
    name: 'examenes',
    meta: { 
      requiresAuth: true,
      title:'Examenes'
     },
    component: () => import(/* webpackChunkName: "examenes" */ '../views/Examenes.vue'),
  },
  {
    path: '/medicamentos',
    name: 'medicamentos',
    meta: { 
      requiresAuth: true,
      title:'Medicamentos'
     },
    component: () => import(/* webpackChunkName: "medicamentos" */ '../views/Medicamentos.vue'),
  },
  {
    path: '/citas',
    name: 'citas',
    meta: { 
      requiresAuth: true,
      title:'Citas'
     },
    component: () => import(/* webpackChunkName: "citas" */ '../views/Citas.vue'),
  },
  {
    path: '/perfil',
    name: 'perfil',
    meta: { 
      requiresAuth: true,
      title:'Perfil'
     },
    component: () => import(/* webpackChunkName: "perfil" */ '../views/Perfil.vue'),
  },
  {
    path: '/recovery',
    name: 'recovery',
    meta: { 
      requiresAuth: false,
      title:'Recovery'
     },
    component: () => import(/* webpackChunkName: "perfil" */ '../views/Recovery.vue'),
  },
  {
    path: '/change-password',
    name: 'change-password',
    meta: { 
      requiresAuth: false,
      title:'Change password'
     },
    component: () => import(/* webpackChunkName: "perfil" */ '../views/ChangePassword.vue'),
  },
  {
    path: '/reportes',
    name: 'reportes',
    meta: { 
      requiresAuth: true,
      title:'Reportes'
     },
    component: () => import(/* webpackChunkName: "reportes" */ '../views/Reportes.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const DEFAULT_TITLE = 'HOSPITAL DEL ORO ';
router.afterEach((to, from) => {
    document.title = to.meta.title  || DEFAULT_TITLE;
});
router.beforeEach(async (to, from, next) => {
  try {
    const rutaProtegida = to.meta.requiresAuth;
    console.log(to.name);
    //  console.log(store.state.roles);
    console.log("siguiente ruta: ", to.path);
    console.log(store.state.token);
    const bandera = store.state.bandera;
    // const roles = [];
    // roles = store.state.roles;
    let isAdministrador = false;
    let isPaciente = false;
    let isMedico = false;
    let isAuxiliar = false;
    let isFarmaceutico = false;
    console.log(" roles:", store.state.roles);
    if (bandera) {
      // roles = async ()=>{
      //   return await store.state.roles;
      // };
      isAdministrador = store.state.roles.some(item => item.nombre === "ADMINISTRADOR");
      isPaciente = store.state.roles.some(item => item.nombre === "PACIENTE");
      isMedico = store.state.roles.some(item => item.nombre === "MEDICO");
      isAuxiliar = store.state.roles.some(item => item.nombre === "AUXILIAR");
      isFarmaceutico = store.state.roles.some(item => item.nombre === "FARMACEUTICO");
    }
    if (rutaProtegida && store.state.token === null) {
      next('/login')
    } else {
      if (isAdministrador) {
        next()
      } else {
        console.log(to.path)
        if ((!isPaciente && !isMedico && !isAuxiliar) 
            && (to.path === "/login" 
            || to.path === "/registrar-paciente" 
            || to.path === "/" 
            || to.path === "/recovery"
            || to.path === "/change-password")) {
          next()
        }
        if (isPaciente && (to.path === "/citas" || to.path === "/" || to.path === "/perfil" || to.path === "/")) {
          next()
        }
        if (isMedico && (to.path === "/" || to.path === "/citas" || to.path ==="/perfil" || to.path === "/")) {
          next()
        }
        if (isFarmaceutico && (to.path === "/" || to.path === "/medicamentos" || to.path ==="/perfil" || to.path === "/")) {
          next()
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

})
export default router
