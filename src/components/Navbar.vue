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
          >
            <v-list-item-title>{{ link.text }}</v-list-item-title>
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
          v-show="visiblePaciente"
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
    visibleNavBar: false,
    auxtoken:null,
    nombres:null,
    visiblePaciente:true,
    roles:[],
    links: [
      { icon: "dashboard", text: "Dashboard", route: "/" },
      { icon: "people", text: "Pacientes", route: "/pacientes" },
      { icon: "people", text: "Personal", route: "/personal" },
      { icon: "folder", text: "Especialidades", route: "/especialidades" },
      // { icon: "folder", text: "Especialista", route: "/especialistas" },
      { icon: "person", text: "Roles", route: "/Roles" },
      { icon: "folder", text: "Catalogos", route: "/Catalogos" },
      { icon: "folder", text: "Examenes", route: "/Examenes" },
      { icon: "folder", text: "Medicamentos", route: "/Medicamentos" },
      { icon: "folder", text: "Citas", route: "/Citas" },
    ],
  }),
 
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
        this.roles = localStorage.getItem("roles");
        console.log(this.roles);
        //this.visiblePaciente= this.roles.some((item) => {item.nombre === "ADMINISTRADOR"});

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
