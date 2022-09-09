<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>open_in_new</v-icon>
      </v-btn>
    </v-app-bar> -->
    <!-- <div id="nav"> -->
    <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/registrar-paciente">Registar Paciente</router-link> -->
    <!-- <button @click="redirectLogin">cerrarSesion</button> -->
    <!-- </div> -->
    <!-- <div>
      <v-tabs fixed-tabs color="deep-purple accent-4" center v-model="tab">
        <v-tab href="#Login"> Login </v-tab>

        <v-tab href="#Registro"> Registro de Paciente </v-tab>
      </v-tabs>
    </div> -->
    <Navbar
      v-if="
        [
          'dashboard',
          'pacientes',
          'personal',
          'roles',
          'especialidades',
          'catalogos',
          'examenes',
          'medicamentos',
          'citas',
          'perfil',
          'reportes'
        ].includes($route.name)
      "
    ></Navbar>
    <NavbarHome v-if="
        [
          'home',
        ].includes($route.name)
      ">
    </NavbarHome>
    <v-main class="ma-4">
      <router-view></router-view>
    </v-main>
    <Footer
      v-if="
        ['dashboard',
          'pacientes',
          'personal',
          'roles',
          'especialidades',
          'catalogos',
          'examenes',
          'medicamentos',
          'citas',
          'perfil',
          'reportes'
          ].includes($route.name)
      "
    ></Footer>

    <!-- <v-main>
      <router-view />
    </v-main> -->
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarHome from "@/components/NavbarHome";
export default {
  name: "App",
  components: {
    Navbar,
    Footer,
    NavbarHome
},
  data: () => ({
    //
    //  visibleNavBar: false,
  }),
  computed: {
    ...mapState(["token" /*'visibleNavBar'*/]),
    // isAuthenticated(){
    //   return this.visibleNavBar;
    // }
  },
  methods: {
    ...mapActions(["leerToken", "cerrarSesion" /*, 'getCatalogos'*/]),
    redirectLogin() {
      // this.$store.commit('setVisibleNavBar', false);
      // localStorage.setItem("visibleNavBar", false);
      this.cerrarSesion();
      this.$router.push({ path: "/login" });
    },
  },
  created: function () {
    // this.visibleNavBar = localStorage.getItem("visibleNavBar");
    this.leerToken();
    // if (this.token !== null) {
    //    this.VisibleNavbar = true;
    //    localStorage.setItem("visibleNavBar", true);
    //    this.$store.commit('setVisibleNavBar', true);
    // }else{
    //   this.VisibleNavbar = false;
    //    localStorage.setItem("visibleNavBar", false);
    //    this.$store.commit('setVisibleNavBar', false)
    // }
  },
  // watch:{
  //   $route(to, from) {
  //           document.title = to.meta.title || 'Hospital del Oro';
  //       },
  // }
};
</script>
<style>
.principal {
  padding-top: 5px;
  padding-right: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
}

html {
  background: #ffffff !important;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.title .v-card__title {
  color: #673ab7;
  text-align: center;
}

.v-tabs-items {
  height: 100%;
}
</style>