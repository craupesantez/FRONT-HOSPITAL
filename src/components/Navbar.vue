<template>
  <nav>
    <v-app-bar color="blue" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">
        <span class="font-weight-light">Hospital del </span>
        <span>Oro</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <v-icon left>expand_more</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list flat>
          <v-list-item
            v-for="link in links"
            :key="link.text"
            router
            :to="link.route"
            active-class="border"
            v-show="link.visible"
          >
            <v-list-item-title v-show="link.visible">{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn text @click="redirectLogin">
        <span>SALIR</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" dark app class="blue darken-4">
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img src="/img1.png" alt="" />
          </v-avatar>
          <p class="white--text subheading mt-1 text-center">{{ nombres }}</p>
          <p class="white--text subheading mt-1 text-center">{{ stringRoles }}</p>
        </v-flex>
        <v-flex class="mt-4 mb-4">
          <!-- s<Popup /> -->
        </v-flex>
      </v-layout>
      <v-list flat>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
          v-show="link.visible"
          active-class="border"
        >
          <v-list-item-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>
<script>
import Popup from "./Popup.vue";
import { mapActions, mapState } from "vuex";
export default {
   computed: {
    // ...mapState(['token', 'visibleNavBar', 'nombres' ]),
  },
  data: () => ({
    drawer: true,
    // visibleNavBar: false,
    auxtoken:null,
    nombres:null,
    stringRoles: "",
    //visiblePaciente:true,
    roles:[],
    links: [
      { icon: "mdi-face-man-profile", text: "Perfil", route: "/perfil" , visible: true},
      { icon: "dashboard", text: "Dashboard", route: "/", visible: true },
      { icon: "mdi-bed-outline", text: "Pacientes", route: "/pacientes", visible: true },
      { icon: "mdi-account-hard-hat", text: "Personal", route: "/personal", visible: true },
      { icon: "mdi-medal", text: "Especialidades", route: "/especialidades" , visible: true},
      // { icon: "folder", text: "Especialista", route: "/especialistas" },
      { icon: "mdi-human-capacity-increase", text: "Roles", route: "/roles" , visible: true },
      { icon: "mdi-clipboard-list-outline", text: "Catálogos", route: "/catalogos" , visible: true },
      { icon: "mdi-notebook-check", text: "Exámenes", route: "/examenes" , visible: true },
      { icon: "mdi-pill", text: "Medicamentos", route: "/medicamentos" , visible: true },
      { icon: "mdi-calendar-multiple", text: "Citas", route: "/citas" , visible: true},
    ],
  }),
  mounted(){
    var roles =this.$store.state.roles;
    let isAdministrador = roles.some(item => item.nombre=== "ADMINISTRADOR");
    let isPaciente = roles.some(item => item.nombre=== "PACIENTE");
    let isMedico = roles.some(item => item.nombre=== "MEDICO");
    let isAuxiiliar = roles.some(item => item.nombre=== "Auxiiliar");
    if(!isAdministrador) {
      if(isPaciente && !isMedico) {
        this.stringRoles= "PACIENTE"
        this.links.forEach((item) =>{
          if(item.route ==="/citas" || item.route ==="/Dashboard" || item.route ==="/perfil"){
            item.visible = true;
          }else{
            item.visible = false;
          }
        }) 
      }else if(isMedico){
        this.stringRoles= "MEDICO"
        this.links.forEach((item) =>{
          if(item.route ==="/citas" || item.route ==="/Dashboard" || item.route ==="/perfil"){
            item.visible = true;
          }else{
            item.visible = false;
          }
        }) 
      }
    }else{
      this.stringRoles= "ADMINISTRADOR"
    }
    console.log( "roles obtenidos del state: " , roles);
  },
  methods: {
    ...mapActions([ "cerrarSesion" /*, 'getCatalogos'*/]),
    redirectLogin() {
      this.cerrarSesion();
      this.$router.push({ path: "/login" });
    },
  },
  components: {
    Popup,
  },
  created: function () {
    try {
      this.auxtoken = localStorage.getItem("token");
      if(this.auxtoken !==null) {
        this.nombres = localStorage.getItem("nombres");
        // this.roles = JSON.parse(localStorage.getItem("roles"));
        console.log(this.roles);

      }
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
<style scoped>
.border {
  border-left: 4px solid #0ba518;
}
</style>
