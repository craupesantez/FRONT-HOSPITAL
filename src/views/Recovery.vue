<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col class="d-flex justify-center">
        <v-card elevation="12" min-width="300" width="600">
          <!-- <div style="text-align: end">
              <v-card-title>Iniciar Sesión</v-card-title>
            </div> -->
          <v-toolbar color="primary">
            <v-toolbar-title>Recupera tu cuenta</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                ref="correo"
                color="accent"
                v-model="usuario.correo"
                :rules="emailRules"
                label="Correo electronico"
                outlined
                required
                v-if="!success"
              >
              </v-text-field>

              <v-alert dense text type="success" v-if="success">
                {{ rta }}
              </v-alert>
              
            </v-form>
          </v-card-text>
          <v-divider class="mt-5" />
          <v-card-actions>
            <!-- <router-link to="/recovery">¿Olvidades la contraseña?
              </router-link> -->
            <v-spacer />
            <v-btn
              align-center
              justify-center
              color="tertiary"
              @click="recuperar"
              :disabled="!valid"
              v-if="!success"
            >
              Continuar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script>
// import  Foto from "@/components/Fotografia.vue";
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "Recovery",
  data() {
    return {
      usuario: {
        correo: "",
      },
      auxtoken: null,
      show1: false,
      rta: "",
      emailRules: [
        (v) => !!v || "El correo es requerido",
        (v) => /.+@.+/.test(v) || "El correo debe ser valido",
      ],
      success: false,
      error: false,
      valid:false,
    };
  },
  
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async recuperar() {
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth/recovery", this.usuario)
          .then((result) => {
            console.log(result.data); 
            this.rta= result.data.message;
            if(this.rta){
                this.success= true;
            }
          });
      } catch (error) {
        console.log(error);
        this.openNotification(
          "",
          2,
          "No autorizado",
          "Estimado usuario, no tiene permisos"
        );
      }
    },
    openNotification(position = null, color, titulo, texto) {
      var c;
      if (color === 1) c = "primary";
      else if (color == 2) c = "danger";
      else if (color == 3) c = "success";
      else if (color == 4) c = "warn";
      else c = "rgb(59,222,200)";

      const noti = this.$vs.notification({
        progress: "auto",
        color: c,
        position,
        title: titulo,
        text: texto,
      });
      console.log(noti);
    },
  },
  created: function () {},
};
</script>