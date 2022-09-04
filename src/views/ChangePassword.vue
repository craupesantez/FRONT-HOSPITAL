<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col class="d-flex justify-center">
        <v-card elevation="12" min-width="300" width="600">
          <!-- <div style="text-align: end">
                <v-card-title>Iniciar Sesión</v-card-title>
              </div> -->
          <v-toolbar color="primary">
            <v-toolbar-title>Registra tu nueva contraseña</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="usuario.contrasenia"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  () =>
                    !!usuario.contrasenia || 'La identificación es requerida',
                ]"
                type="password"
                name="input-10-2"
                color="accent"
                label="Contraseña"
                hint="Minimo 8 caracteres"
                placeholder="*********"
                counter
                class="input-group--focused"
                @click:append="show2 = !show2"
                outlined
                required
                v-if="!success"
              >
              </v-text-field>
              <v-text-field
                v-model="usuario.repetirContrasenia" 
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[
                  () =>
                    !!usuario.repetirContrasenia || 'La identificación es requerida',
                ]"
                type="password"
                name="input-10-2"
                color="accent"
                label="Repetir contrasenia"
                hint="Minimo 8 caracteres"
                placeholder="*********"
                counter
                class="input-group--focused"
                @click:append="show2 = !show2"
                outlined
                required
                v-if="!success"
              >
              </v-text-field>

              <v-alert dense text type="success" v-if="success">
               {{ rta }}
              </v-alert>
              <v-alert dense text type="error" v-if="!validarContrasenia">
               La contraseña no coincide 
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
              @click="cambiarContrasenia"
              :disabled="!valid"
              v-if="!success"
            >
              Guardar
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
  name: "Cambio",
  data(vm) {
    return {
      usuario: {
        contrasenia: "",
        repetirContrasenia: "", //
      },
      auxtoken: null,
      show1: false,
      show2: true,
      tokenCon: "",
      rta: "",
      emailRules: [
        (v) => !!v || "El correo es requerido",
        (v) => /.+@.+/.test(v) || "El correo debe ser valido",
      ],
      success: false,
      coincide: false,
      error: false,
      valid: false,
    };
  },

  methods: {
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async cambiarContrasenia() {
      try {
        let cambio={
            token: this.tokenCon,
            contrasenia:this.usuario.contrasenia
        }
        await axios
          .post("http://localhost:3000/api/v1/auth/change-password", cambio)
          .then((result) => {
            console.log(result.data);
            this.rta = result.data.message;
            if (this.rta) {
              this.success = true;
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
  watch: {
    "$route.query.token": {
      immediate: true,
      handler(token) {
        console.log(`token a cambiado ${token}`);
        this.tokenCon = token;
      },
    },
  },
  computed:{
    validarContrasenia(){
        if(this.usuario.contrasenia === this.usuario.repetirContrasenia){
            this.coincide = true;
        }else{
            this.coincide = false;
        }
        return this.coincide;
    }
  }
};
</script>