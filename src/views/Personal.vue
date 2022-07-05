<template>
  <v-data-table
    :headers="headers"
    :items="pacientes"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Personal Hospitalario</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Personal
            </v-btn>
          </template>
          <v-card max-width="700">
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.nombres"
                    :rules="[
                      () =>
                        !!editedItem.nombres || 'Los nombres son requeridos',
                    ]"
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
                    v-model="editedItem.apellidos"
                    :rules="[
                      () =>
                        !!editedItem.apellidos ||
                        'Los apellidos son requeridos',
                    ]"
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
                    v-model="editedItem.tipoIdentificacionId"
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
                    v-model="editedItem.identificacion"
                    :rules="identificacionRules"
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
                    v-model="editedItem.generoId"
                    item-value="id"
                    :items="generos"
                    :filter="customFilter"
                    color="accent"
                    item-text="nombre"
                    label="Genero"
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
                        v-model="editedItem.fechaNacimiento"
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
                      v-model="editedItem.fechaNacimiento"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.catalogoId"
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
                    v-model="editedItem.telefono"
                    color="accent"
                    label="Telefono"
                    required
                    outlined
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
                  >
                  </v-text-field>
                </v-col>

                <v-col class="d-flex" cols="12" sm="6" v-show="setDisable">
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
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-select
                    label="Seleccionar roles"
                    :items="allRoles"
                    :deletable-chips="multipleRoles.length > 1"
                    hide-selected
                    v-model="multipleRoles"
                    item-text="nombre"
                    item-value="id"
                    max-height="auto"
                    required
                    multiple
                  ></v-select>
                </v-col>
                {{ multipleRoles }}
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
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
        </v-dialog>
      </v-toolbar>
    </template>
    <v-snackbar v-model="hasSaved" :timeout="2000" absolute bottom left>
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
      <v-btn color="primary" @click="getPersonal"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";
export default {
  data: (vm) => ({
    allRoles: [],
    nombreComponent: "Personal",
    dialog: false,
    dialogDelete: false,
    catalogos: [],
    generos: [],
    show2: true,
    menu2: false,
    errorMessages: "",
    visibleContrasenia: true,
    tiposIdentificacion: [],
    existeIdentificacion: false,
    existeCorreo: false,
    identificacionRules: [(v) => !!v || "identificacion requerida"],
    multipleRoles: [],
    activoItemId: "",
    hasSaved: false,
    noSaved: false,
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
      { text: "Genero", value: "genero.nombre" },
      { text: "Edad", value: "edad" },
      { text: "Identificacion", value: "identificacion" },
      { text: "Correo", value: "correo" },
      { text: "Telefono", value: "telefono" },
      { text: "Roles", value: "`${roles[0].nombre} -${roles[1].nombre}`" },
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
      usuario: {
        username: "",
        contrasenia: "",
      },
      catalogoId: "",
      generoId: "",
      tipoIdentificacionId: "",
    },
    defaultItem: {
      nombres: "",
      apellidos: "",
      telefono: "",
      // foto:"https://rockcontent.com/es/wp-content/uploads/sites/3/2019/02/foto-de-perfil-para-instagram.png",
      fechaNacimiento: "",
      identificacion: "",
      correo: "",
      usuario: {
        username: "",
        contrasenia: "",
      },
      catalogoId: "",
      generoId: "",
      tipoIdentificacionId: "",
    },
    edad: 0,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Personal" : "Editar Personal";
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
    getAge(dateString) {
      var today = new Date();
      var birthDate = new Date(dateString);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.edad = age;
    },

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
    async getPersonal() {
      try {
        await axios
          .get("http://localhost:3000/api/v1/personas")
          .then((result) => {
            // this.catalogos = result.data;
            let res = result.data;
            let roles = [];
            this.personas = res;
            let rolPaciente = false;
            this.pacientes = res.filter((item) => {
              roles = item.roles;
              rolPaciente = roles.some((rol) => rol.nombre !== "PACIENTE");
              if (rolPaciente && item.activo) {
                this.getAge(item.fechaNacimiento);
                item.edad = this.edad;
                return item;
              }
            });

            console.log(this.pacientes);
            this.getCatalogos();
            this.getRoles();
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getRoles() {
      await axios.get("http://localhost:3000/api/v1/roles").then((result) => {
        let res = result.data;
        this.allRoles = res.filter((item) => item.activo == true);
        console.log(this.allRoles);
      });
    },
    async getCatalogos() {
      try {
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
      } catch (error) {
        console.log(error);
      }
    },
    editItem(item) {
      console.log(item.id);
      console.log(this.pacientes.indexOf(item));
      this.editedIndex = this.pacientes.indexOf(item);
      this.visibleContrasenia = false;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.pacientes.indexOf(item);
      this.activoItemId = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        let pacienteEstado;
        await axios
          .patch(`http://localhost:3000/api/v1/personas/${this.activoItemId}`, {
            activo: false,
          })
          .then((result) => {
            pacienteEstado = result.data;
            console.log(pacienteEstado);
          });
        this.pacientes.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.log(error);
      }
    },

    close() {
      this.dialog = false;
      this.visibleContrasenia = true;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.visibleContrasenia = true;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      try {
        if (this.editedIndex > -1) {
          console.log(this.pacientes[this.editedIndex].id);
          let idPaciente = this.pacientes[this.editedIndex].id;
          delete this.editedItem.usuario;
          delete this.editedItem.id;
          delete this.editedItem.roles;
          delete this.editedItem.genero;
          delete this.editedItem.tipoIdentificacion;
          delete this.editedItem.edad;
          delete this.editedItem.catalogo;
          delete this.editedItem.foto;
          delete this.editedItem.fechaRegistro;
          delete this.editedItem.activo;
          delete this.editedItem.ramas;
          this.editedItem.fechaActualizo = new Date();
          console.log(this.editedItem);
          await axios
            .patch(
              `http://localhost:3000/api/v1/personas/${idPaciente}`,
              this.editedItem
            )
            .then((result) => {
              this.editedItem = result.data;
              delete this.editedItem.ramas;
              Object.assign(this.pacientes[this.editedIndex], this.editedItem);
            });
          this.visibleContrasenia = true;
        } else {
          // this.existeIdentificacion = this.personas.some(
          //   (item) => item.identificacion === this.editItem.identificacion
          // );
          // this.existeCorreo = this.personas.some(
          //   (item) => item.correo === this.editItem.correo
          // );
          // if (existeCorreo || existeIdentificacion) {
          //   this.noSaved = true;
          // } else {
          this.editedItem.activo = true;
          await axios
            .post(
              "http://localhost:3000/api/v1/personas/personal",
              this.editedItem
            )
            .then((result) => {
              //commit('setToken', result.data.token);
              this.editedItem = result.data;
              if (this.editedItem !== null) {
                this.hasSaved = true;
                this.editedItem.edad = this.getAge(
                  this.editItem.fechaNacimiento
                );
                this.pacientes.push(this.editedItem);
                this.getPersonal();
                // this.resetForm();
                // this.$router.push({name:'about'});
              }
            });
          // }
        }
        this.close();
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getPersonal();
  },
};
</script>