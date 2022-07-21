<template>
  <v-card>
    <v-toolbar flat color="info darken-1">
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light">
        Editar Perfil
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-switch
        v-model="enablePerfil"
        label="Habilitar edición"
        color="primary"
        @change="updatePedidoByCita(dialogExamenes)"
      ></v-switch>
      <v-row>
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
            v-model="editedItem.nombres"
            :rules="[
              () => !!editedItem.nombres || 'Los nombres son requeridos',
            ]"
            :error-messages="errorMessages"
            color="accent"
            label="Nombres"
            required
            outlined
            :disabled="!enablePerfil"
          >
          </v-text-field>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
            v-model="editedItem.apellidos"
            :rules="[
              () => !!editedItem.apellidos || 'Los apellidos son requeridos',
            ]"
            :error-messages="errorMessages"
            color="accent"
            label="Apellidos"
            required
            outlined
            :disabled="!enablePerfil"
          >
          </v-text-field>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-autocomplete
            v-model="editedItem.tipoIdentificacion"
            item-value="tipoIdentificacionId"
            :items="tiposIdentificacion"
            :filter="customFilter"
            color="accent"
            item-text="nombre"
            label="Tipo de Identificación"
            required
            return-object
            no-data-text="No existen pacientes"
            outlined
            :disabled="!enablePerfil"
          ></v-autocomplete>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
            v-model="editedItem.identificacion"
            :rules="[
              () =>
                !!editedItem.identificacion || 'La identificación es requerida',
            ]"
            :counter="10"
            :error-messages="errorMessages"
            color="accent"
            label="Identificación"
            required
            outlined
            :disabled="!enablePerfil"
          >
          </v-text-field>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-autocomplete
            v-model="editedItem.genero"
            item-value="generoId"
            :items="generos"
            :filter="customFilter"
            color="accent"
            item-text="nombre"
            label="Género"
            required
            outlined
            :disabled="!enablePerfil"
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
                v-model="editedItem.fechaNacimiento"
                label="Fecha de nacimiento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                required
                outlined
                :disabled="!enablePerfil"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="editedItem.fechaNacimiento"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6">
          <v-autocomplete
            v-model="editedItem.catalogo"
            item-value="catalogoId"
            :items="catalogos"
            :filter="customFilter"
            color="accent"
            item-text="nombre"
            label="Ciudad"
            required
            outlined
            :disabled="!enablePerfil"
          ></v-autocomplete>
        </v-col>

        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
            v-model="editedItem.telefono"
            color="accent"
            label="Teléfono"
            required
            outlined
            :disabled="!enablePerfil"
          >
          </v-text-field>
        </v-col>

        <v-col class="d-flex" cols="12" sm="6">
          <v-text-field
            color="accent"
            v-model="editedItem.correo"
            :rules="emailRules"
            label="Correo"
            outlined
            :disabled="!enablePerfil"
          >
          </v-text-field>
        </v-col>

        <!-- <v-col class="d-flex" cols="12" sm="6" v-show="setDisable">
          <v-text-field
            v-model="editedItem.usuario.username"
            color="accent"
            label="Usuario"
            outlined
            v-show="setDisable"
          >
          </v-text-field>
        </v-col>
        <v-col class="d-flex" cols="12" sm="6" v-show="setDisable">
          <v-text-field
            v-model="editedItem.usuario.contrasenia"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[
              () =>
                !!editedItem.usuario.contrasenia ||
                'La contrasenia es requerida',
            ]"
            type="password"
            name="input-10-2"
            color="accent"
            label="Constraseña"
            hint="Minimo 8 caracteres"
            counter
            value="wqfasds"
            class="input-group--focused"
            @click:append="show2 = !show2"
            outlined
            v-show="setDisable"
          >
          </v-text-field>
        </v-col> -->
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn> -->
      <v-btn color="blue warning" text @click="save" :disabled="!enablePerfil"> Guardar </v-btn>
    </v-card-actions>
  </v-card>
  <!-- </v-dialog> -->

  <!-- <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >¿Estas seguro de que quieres eliminar
              {{ nombreComponent }} ?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancelar</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
  <!-- </v-toolbar> -->
  <!-- </template> -->
  <!-- <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
      El paciente fue registrado
    </v-snackbar>
    <v-snackbar v-model="noSaved" :timeout="2000" absolute bottom left>
      Identificacion o correo ya se encuentran registradas identificacion:{{
        existeIdentificacion
      }}
      correo:{{ existeCorreo }}
    </v-snackbar>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getPacientes"> Reset </v-btn>
    </template> -->
  <!-- </v-data-table> -->
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  data: (vm) => ({
    nombreComponent: "Paciente",
    enablePerfil: false,
    idUsuario: null,
    dialog: false,
    dialogDelete: false,
    catalogos: [],
    generos: [],
    hasSaved: false,
    noSaved: false,
    show2: true,
    menu2: false,
    errorMessages: "",
    visibleContrasenia: true,
    tiposIdentificacion: [],
    existeIdentificacion: false,
    existeCorreo: false,
    activoItemId: "",
    rulesObject: {
      required: (value) => !!value || "Campo requerido",
      min: (v) => v.length >= 8 || "Minimo 8 carácteres",
    },
    emailRules: [
      (v) => !!v || "El correo es requerido",
      (v) => /.+@.+/.test(v) || "El correo debe ser valido",
    ],
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nombres", value: "nombres" },
      { text: "Apellidos", value: "apellidos" },
      { text: "Género", value: "genero.nombre" },
      { text: "Edad", value: "edad" },
      { text: "Identificación", value: "identificacion" },
      { text: "Correo", value: "correo" },
      { text: "Teléfono", value: "telefono" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    personas: [],
    pacientes: [],
    editedIndex: -1,
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
    editedItem: {
      nombres: "",
      apellidos: "",
      telefono: "",
      // foto:"https://rockcontent.com/es/wp-content/uploads/sites/3/2019/02/foto-de-perfil-para-instagram.png",
      fechaNacimiento: "",
      identificacion: "",
      correo: "",

      catalogo: [],
      genero: [],
      tipoIdentificacion: [],
    },
    defaultItem: {
      nombres: "",
      apellidos: "",
      telefono: "",
      // foto:"https://rockcontent.com/es/wp-content/uploads/sites/3/2019/02/foto-de-perfil-para-instagram.png",
      fechaNacimiento: "",
      identificacion: "",
      correo: "",
    //   usuario: {
    //     username: "",
    //     contrasenia: "",
    //   },
      catalogo: [],
      genero: [],
      tipoIdentificacion: [],
    },
    edad: 0,
  }),
  mounted() {
    this.idUsuario = this.$store.state.id;
    console.log("id del usuario get store:", this.idUsuario);
    this.getCatalogos();
    this.getPerfil();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Paciente" : "Editar Paciente";
    },
    setDisable() {
      return this.visibleContrasenia;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async getPerfil() {
      await axios
        .get(`http://localhost:3000/api/v1/personas/${this.idUsuario}`)
        .then((result) => {
          console.log("resultado de perfil:", result.data);
          this.editedItem = {
            nombres: result.data.nombres,
            apellidos: result.data.apellidos,
            telefono: result.data.telefono,
            // foto:"https://rockcontent.com/es/wp-content/uploads/sites/3/2019/02/foto-de-perfil-para-instagram.png",
            fechaNacimiento: result.data.fechaNacimiento,
            identificacion: result.data.identificacion,
            correo: result.data.correo,
            // usuario: {
            //   username: "",
            //   contrasenia: "",
            // },
            catalogo: {catalogoId: result.data.catalogoId},
            genero: {generoId: result.data.generoId},
            tipoIdentificacion: {tipoIdentificacionId: result.data.tipoIdentificacionId},
          };
        });
    },
    // getAge(dateString) {
    //   var today = new Date();
    //   var birthDate = new Date(dateString);
    //   var age = today.getFullYear() - birthDate.getFullYear();
    //   var m = today.getMonth() - birthDate.getMonth();
    //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    //     age--;
    //   }
    //   this.edad = age;
    // },
    customFilter(item, queryText, itemText) {
      const textOne = item.nombre.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
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
    // esto de adebajo se va
    // async getPacientes() {
    //   try {
    //     await axios
    //       .get("http://localhost:3000/api/v1/personas")
    //       .then((result) => {
    //         // this.catalogos = result.data;
    //         let res = result.data;
    //         let roles = [];
    //         this.personas = res;
    //         console.log("los siguientes son las personas");
    //         console.log(this.personas);
    //         let rolPaciente = false;
    //         this.pacientes = res.filter((item) => {
    //           roles = item.roles;
    //           rolPaciente = roles.some((rol) => rol.nombre === "PACIENTE");
    //           if (rolPaciente && item.activo) {
    //             this.getAge(item.fechaNacimiento);
    //             item.edad = this.edad;
    //             return item;
    //           }
    //         });
    //         console.log(this.pacientes);
    //         this.getCatalogos();
    //       });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    //hasta aqui

    async getCatalogos() {
      try {
        await axios
          .get("http://localhost:3000/api/v1/catalogos")
          .then((result) => {
            // this.catalogos = result.data;
            let res = result.data;
            this.catalogos = res.filter((item) => {
              if (item.tipo === "CIUDAD") {
                item.catalogoId =item.id;
                return item;
              }
            });
            this.generos = res.filter((item) => {
              if (item.tipo === "GENERO") {
                item.generoId =item.id;
                return item;
              }
            });
            this.tiposIdentificacion = res.filter((item) => {
              if (item.tipo === "IDENTIFICACION") {
                item.tipoIdentificacionId =item.id;
                return item;
              }
            });
            console.log(this.catalogos);
          });
      } catch (error) {
        console.log(error);
      }
    },
    // editItem(item) {
    //   console.log(item.id);
    //   console.log(this.pacientes.indexOf(item));
    //   this.editedIndex = this.pacientes.indexOf(item);
    //   this.visibleContrasenia = false;
    //   this.editedItem = Object.assign({}, item);
    //   this.dialog = true;
    // },

    // deleteItem(item) {
    //   this.editedIndex = this.pacientes.indexOf(item);
    //   this.activoItemId = item.id;
    //   this.editedItem = Object.assign({}, item);
    //   this.dialogDelete = true;
    // },

    // async deleteItemConfirm() {
    //   try {
    //     let pacienteEstado;
    //     await axios
    //       .patch(`http://localhost:3000/api/v1/personas/${this.activoItemId}`, {
    //         activo: false,
    //       })
    //       .then((result) => {
    //         pacienteEstado = result.data;
    //         console.log(pacienteEstado);
    //       });
    //     this.pacientes.splice(this.editedIndex, 1);
    //     this.closeDelete();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },

    // close() {
    //   this.dialog = false;
    //   this.visibleContrasenia = true;
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem);
    //     this.editedIndex = -1;
    //   });
    // },

    // closeDelete() {
    //   this.dialogDelete = false;
    //   this.visibleContrasenia = true;
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem);
    //     this.editedIndex = -1;
    //   });
    // },

    async save() {
      try {
        
          this.editedItem.fechaActualizo = new Date();
          let updatePerfil = {
            nombres: this.editedItem.nombres,
            apellidos: this.editedItem.apellidos,
            telefono: this.editedItem.telefono,
            // foto:"https://rockcontent.com/es/wp-content/uploads/sites/3/2019/02/foto-de-perfil-para-instagram.png",
            fechaNacimiento: this.editedItem.fechaNacimiento,
            identificacion: this.editedItem.identificacion,
            correo: this.editedItem.correo,
            fechaActualizo:  this.editedItem.fechaActualizo,
            // usuario: {
            //   username: "",
            //   contrasenia: "",
            // },
            catalogoId: this.editedItem.catalogo.catalogoId,
            generoId: this.editedItem.genero.generoId,
            tipoIdentificacionId: this.editedItem.tipoIdentificacion.tipoIdentificacionId,
          }
          console.log(this.editedItem);
          await axios
            .patch(
              `http://localhost:3000/api/v1/personas/${this.idUsuario}`,
              updatePerfil
            )
            .then((result) => {
            //   this.editedItem = result.data;
            //   console.log("resultdata:",result.data)
            //   delete this.editedItem.ramas;
              this.getPerfil();
            });
        
        
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    //this.getPacientes();
    this.getCatalogos();
    this.getPerfil();
  },
};
</script>