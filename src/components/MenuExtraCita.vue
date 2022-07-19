<template>
  <v-card>
    <v-tabs background-color="cyan" dark flat show-arrows>
      <!-- <v-tabs-slider color="yellow"></v-tabs-slider> -->
      <v-tab> Pedido de Examenes </v-tab>

      <v-tab> Medicamentos Recetados </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <Pedidos ref="Pedidos"></Pedidos>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <recetas ref="recetas"></recetas>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <!-- <v-tabs-items> -->

    <!-- </v-tabs-items> -->
  </v-card>
</template>
<script>
import Recetas from "./Recetas";
import Pedidos from "./Pedidos";
export default {
  components: {
    'recetas':Recetas,

    Pedidos,
  },
  data() {
    return {
      bandera: false,
    };
  },
  methods: {
    defaultPedido(value) {
        this.$refs.Pedidos.defaultPedidoHijo(value);
    },
    defaultReceta(value){
      this.$refs.recetas.defaultRecetaHijo(value);
    },
    defaultTabs(value){
      this.bandera =value;
      this.defaultPedido(this.bandera);
      this.defaultReceta(this.value);
    }
  },
};
</script>