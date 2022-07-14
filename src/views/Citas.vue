<template>
  <v-card>
    <!-- <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Citas Medicas</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical>
      <v-tab>
        <v-icon left> mdi-account </v-icon>
        Agendar Cita
      </v-tab>
      <v-tab>
        <v-icon left> mdi-notebook-check </v-icon>
        Pedido de Examenes
      </v-tab>
      <v-tab>
        <v-icon left> mdi-book-open-outline </v-icon>
        Receta
      </v-tab>

      <v-tab-item>
        <v-card flat> -->
          <v-card-text>
            <Calendario></Calendario>
          </v-card-text>
        <!-- </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <Pedidos></Pedidos>
          </v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <Recetas></Recetas>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs> -->
  </v-card>
</template>
<script>
import Calendario from "../components/Calendario";
import Recetas from "../components/Recetas";
import Pedidos from "../components/Pedidos";

export default {
  components: {
    Calendario,
    Recetas,
    Pedidos,
  },
  data: () => ({}),
};
</script>