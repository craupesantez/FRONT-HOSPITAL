<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      absolute
      color="#6A76AB"
      dark
      shrink-on-scroll
      prominent
      src="https://fondosmil.com/fondo/56882.jpg"
      fade-img-on-scroll
      scroll-target="#scrolling-techniques-3"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-app-bar-title>Hospital del Oro</v-app-bar-title>

      <v-spacer></v-spacer>

      <template v-slot:extension>
        <v-tabs align-with-title v-model="tab">
          <v-tab href="/login">Ingresar</v-tab>
          <v-tab href="/registrar-paciente">Registrate como Paciente</v-tab>
          <v-tab key="k1" href="#k1">Quienes somos?</v-tab>
          <!-- <v-tab key="k2" href="#k2">Acerca de</v-tab> -->
        </v-tabs>
      </template>
    </v-app-bar>
    <v-sheet id="scrolling-techniques-3" class="overflow-y-auto">
      <v-container style="max-width: 95%">
        <v-tabs-items v-model="tab">
          <v-tab-item key="k1" value="k1">
            <div class="pt-16"></div>
            <div class="pt-16"></div>
            <div class="pt-16"></div>
            <div class="pt-11"></div>
            <HelloWorld></HelloWorld>
            <CarruselImagenes></CarruselImagenes>
            <GoogleMaps :latitude= -3.330940 :longitude= -79.812247 :title="'Titulo Marcador'" />
          </v-tab-item>
          <!-- <div class="pt-16"></div>
          <div class="pt-16"></div>
          <div class="pt-16"></div>
          <div class="pt-16"></div>
          <v-tab-item key="k2" value="k2">Data 2</v-tab-item> -->
          
        </v-tabs-items>        
      </v-container>
    </v-sheet>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import HelloWorld from "@/components/HelloWorld.vue";
import CarruselImagenes from "./CarruselImagenes.vue";
import GoogleMaps from "@/components/GoogleMaps.vue";

export default {
  components: {
    HelloWorld,
    HelloWorld,
    CarruselImagenes,
    GoogleMaps
  },
  data: () => ({
    tab: "k1",
  }),
};
</script>

<style>
.v-app-bar-title__content {
  width: 200px !important;
}
</style>