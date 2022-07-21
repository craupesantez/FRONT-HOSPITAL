<template>
  <!-- <v-card class="overflow-hidden" color="grey lighten-1" dark> -->
  <v-card
    class="mx-auto mt-10 title"
    elevation="24"
    rounded
    max-width="700"
    ref="form"
  >
    <v-toolbar flat color="info darken-1">
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">
        Registro del Paciente
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validatio>
      <v-row>
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
            ref="nombres"
            v-model="nombres"
            :rules="[() => !!nombres || 'Los nombres son requeridos']"
            :error-messages="errorMessages"
            color="accent"
            label="Nombres"
            required
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
            ref="apellidos"
            v-model="apellidos"
            :rules="[() => !!apellidos || 'Los apellidos son requeridos']"
            :error-messages="errorMessages"
            color="accent"
            label="Apellidos"
            required
            outlined
          >
          </v-text-field>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-autocomplete
          ref="tipoIdentificacionId"
          v-model="tipoIdentificacionId"
          item-value="id"
          :items="tiposIdentificacion"
          :filter="customFilter"
          color="accent"
          item-text="nombre"
          label="Tipo de Identificación"
          required
          outlined
        ></v-autocomplete>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
            ref="identificacion"
            v-model="identificacion"
            :rules="[
              () => !!identificacion || 'La identificación es requerida',
            ]"
            :counter="10"
            :error-messages="errorMessages"
            color="accent"
            label="Identificación"
            required
            outlined
          >
          </v-text-field>
        </v-col>
         <v-col class="d-flex" cols="12" sm="6">
          <v-autocomplete
          ref="generoId"
          v-model="generoId"
          item-value="id"
          :items="generos"
          :filter="customFilter"
          color="accent"
          item-text="nombre"
          label="Género"
          required
          outlined
        ></v-autocomplete>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                ref="fechaNacimiento"
                v-model="fechaNacimiento"
                label="Fecha de nacimiento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                required
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fechaNacimiento"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-autocomplete
          ref="catalogoId"
          v-model="catalogoId"
          item-value="id"
          :items="catalogos"
          :filter="customFilter"
          color="accent"
          item-text="nombre"
          label="Ciudad"
          required
          outlined
        ></v-autocomplete>
        </v-col>
        
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
          ref="telefono"
          v-model="telefono"
          color="accent"
          label="Telefono"
          required
          outlined
        >
        </v-text-field>
        </v-col>
        
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
          ref="correo"
          color="accent"
          v-model="correo"
          :rules="emailRules"
          label="Correo"
          outlined
          required
        >
        </v-text-field>
        </v-col>
        
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
          ref="username"
          v-model="username"
          color="accent"
          label="Usuario"
          outlined
          required
        >
        </v-text-field>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
          ref="contrasenia"
          v-model="contrasenia"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[() => !!contrasenia || 'La identificación es requerida']"
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
        >
        </v-text-field>
        </v-col>
        
      </v-row>
    </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="save" :disabled="!valid"> Guardar </v-btn>
      <v-btn color="secundary" @click="resetForm"> Limpiar </v-btn>
    </v-card-actions>
    <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
      El paciente fue registrado
    </v-snackbar>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data(vm) {
    return {
      hasSaved: false,
      isEditing: null,
      model: null,
      valid: false,
      catalogos: [],
      generos:[],
      tiposIdentificacion: [],
      rulesObject: {
        required: (value) => !!value || "Campo requerido",
        min: (v) => v.length >= 8 || "Minimo 8 carácteres",
      },
      emailRules: [
        (v) => !!v || "El correo es requerido",
        (v) => /.+@.+/.test(v) || "El correo debe ser valido",
      ],
      show2: true,
      nombres: null,
      apellidos: null,
      telefono: null,
      errorMessages: "",
      fechaNacimiento: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10),
      dateFormatted: vm.formatDate(
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      ),
      identificacion: null,
      correo: null,
      // usuario: {
      username: null,
      contrasenia: null,
      // },
      catalogoId: null,
      generoId: null,
      tipoIdentificacionId: null,
      password: "Password",
      menu2: false,
      formHasErrors: false,
    };
  },
  computed: {
    form() {
      return {
        nombres: this.nombres,
        apellidos: this.apellidos,
        telefono: this.telefono,
        // foto:"https://rockcontent.com/es/wp-content/uploads/sites/3/2019/02/foto-de-perfil-para-instagram.png",
        fechaNacimiento: this.fechaNacimiento,
        identificacion: this.identificacion,
        correo: this.correo,
        // usuario: this.usuario,
        username: this.username,
        contrasenia: this.contrasenia,
        catalogoId: this.catalogoId,
        generoId: this.generoId,
        tipoIdentificacionId: this.tipoIdentificacionId, //
      };
    },
    computedDateFormatted() {
      return this.formatDate(this.fechaNacimiento);
    },
  },
  watch: {
    nombres() {
      this.errorMessages = "";
    },
    date(val) {
      this.dateFormatted = this.formatDate(this.fechaNacimiento);
    },
  },
  methods: {
    customFilter(item, queryText, itemText) {
      const textOne = item.nombre.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    resetForm() {
      this.errorMessages = [];
      this.formHasErrors = false;
      Object.keys(this.form).forEach((f) => {
        this.$refs[f].reset();
      });
    },
    async getCatalogos() {
      await axios
        .get("http://localhost:3000/api/v1/catalogos")
        .then((result) => {
          // this.catalogos = result.data;
          let res = result.data;
          this.catalogos = res.filter((item) => {
            if (item.tipo === "CIUDAD") {
              console.log(item.nombre);
              return item;
            }
          });
          this.generos = res.filter((item) => {
            if (item.tipo === "GENERO") {
              console.log(item.nombre);
              return item;
            }
          });
          this.tiposIdentificacion = res.filter((item) => {
            if (item.tipo === "IDENTIFICACION") {
              console.log(item.nombre);
              return item;
            }
          });
          console.log(this.catalogos);
        });
    },
    async save() {
      try {
        //this.isEditing = !this.isEditing
        this.formHasErrors = false;
        console.log(this.form);
        let newPaciente = {
          nombres: this.form.nombres,
          apellidos: this.form.apellidos,
          telefono: this.form.telefono,
          // foto:"https://rockcontent.com/es/wp-content/uploads/sites/3/2019/02/foto-de-perfil-para-instagram.png",
          fechaNacimiento: this.form.fechaNacimiento,
          identificacion: this.form.identificacion,
          correo: this.form.correo,
          usuario: {
            username: this.form.username,
            contrasenia: this.form.contrasenia,
          },
          catalogoId: this.form.catalogoId,
          generoId: this.form.generoId,
          tipoIdentificacionId: this.form.tipoIdentificacionId,
          activo: true,
        };
        console.log(newPaciente);
        let resultado = null;
        await axios
          .post("http://localhost:3000/api/v1/personas", newPaciente)
          .then((result) => {
            //commit('setToken', result.data.token);
            resultado = result.data;
            if (resultado !== null) {
              console.log(resultado);
              this.hasSaved = true;
              this.resetForm();
              // this.$router.push({name:'about'});
            }
          });
      } catch (error) {
        console.log(error.response.data.message);
        this.openNotification(
            "",
            2,
            "No se pudo registrar",
            "Estimado usuario, sus datos no son correctos: "+ error.response.data.message 
          );

      }
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
  created() {
    this.getCatalogos();
  },
};
</script>