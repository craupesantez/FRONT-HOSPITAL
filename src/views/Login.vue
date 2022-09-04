<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col class="d-flex justify-center">
        <v-card
          elevation="12" 
          min-width="300" 
          width="600" 
        >
          <!-- <div style="text-align: end">
            <v-card-title>Iniciar Sesión</v-card-title>
          </div> -->
          <v-toolbar color="primary">
						<v-toolbar-title>Iniciar Sesión</v-toolbar-title>
						<v-spacer />
					</v-toolbar>
          <v-card-text>
            <v-form
            >
              <v-text-field
                v-model="usuario.username"
                :counter="15"
                label="Usuario"
                required
                outlined
              ></v-text-field>

              <v-text-field
                v-model="usuario.contrasenia"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                type="password"
                name="input-10-2"
                label="Contraseña"
                placeholder="*********"
                hint="Al menos 8 carácteres"
                counter
                color="accent"
                class="input-group--focused"
                @click:append="show1 = !show1"
                required
                outlined
              ></v-text-field>
              <!-- <v-btn color="success lighten-2" type="submit" :disabled="!valid">
                Ingresar
              </v-btn>
              <v-btn color="secundary lighten-2" text @click="reset">
                Limpiar
              </v-btn> -->
            </v-form>
          </v-card-text>
          <v-divider class="mt-5" />
          <v-card-actions>
            <router-link to="/recovery">¿Olvidades la contraseña?
            </router-link>
						<v-spacer />
						<v-btn align-center
                   justify-center 
                   color="tertiary" 
                   @click="login"
                   :disabled="!valid"
            > Ingresar 
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
  name: 'Login',
  data() {
    return {
      usuario: {
        username: "craupesantez",
        contrasenia: "cesar1234",
      },
      auxtoken: null,
      show1: false,
      rules: {
        required: (value) => !!value || "Campo requerido",
        min: (v) => v.length >= 8 || "Minimo 10 carácteres",
      },
      valido: true,
      valid: true,
    };
  },
  mounted(){
    try {
      this.auxtoken = localStorage.getItem("token");
      if (this.auxtoken !== null) {
        this.$router.push("/perfil");
      }else{
        // localStorage.setItem("visibleNavBar", false);
      }
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    ...mapState(["token", "nombres", "apellidos", "id", "roles"]),
  },
  methods: {
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async login() {
      try {
        await axios
          .post("http://localhost:3000/api/v1/auth/login", this.usuario)
          .then((result) => {
            console.log(result);
            this.$store.commit('setToken', result.data.token);
            if(result.data.token!==null){
              // this.$store.commit('setVisibleNavBar', true);
              this.$store.commit('setRoles', result.data.user.persona.roles);
              this.$store.commit('setBandera', true);
              this.$store.commit('setId', result.data.user.persona.id);
              localStorage.setItem("token", result.data.token);
              localStorage.setItem("nombres", result.data.user.persona.nombres);
              localStorage.setItem("apellidos", result.data.user.persona.apellidos);
              localStorage.setItem("id", result.data.user.persona.id);
              localStorage.setItem("roles", JSON.stringify(result.data.user.persona.roles));
              localStorage.setItem("username", JSON.stringify(result.data.user.username));
              localStorage.setItem("bandera", true);
              this.auxtoken = result.data.token;
            }else{
              // this.$store.commit('setVisibleNavBar', false);
            }  
            // localStorage.setItem("token", result.data.token);
            // localStorage.setItem("nombres", result.data.user.persona.nombres);
            // localStorage.setItem("apellidos", result.data.user.persona.apellidos);
            // localStorage.setItem("id", result.data.user.persona.id);
            // localStorage.setItem("roles", JSON.stringify(result.data.user.persona.roles));
            // localStorage.setItem("username", JSON.stringify(result.data.user.username));
            // localStorage.setItem("bandera", true);
            // this.auxtoken = result.data.token;
            if (this.auxtoken !== null) {
              this.$router.push({ path: "/perfil" });
              // this.$router.push({name:'about'});
            }
          });
      } catch (error) {
        console.log(error);
       this.openNotification(
            "",
            2,
            "No se pudo ingresar",
            "Estimado usuario, sus datos no son correctos"
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
  created: function () {
    
  },
};
</script>