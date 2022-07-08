<template>
  <v-data-table
    :headers="headers"
    :items="personal"
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

        <v-dialog v-model="dialogRoles" max-width="700">
          <template>
            <v-card max-width="700">
              <v-card-title>
                <span class="text-h5">Agregar Roles</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      :value="itemNombres"
                      label="Nombre Completo"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="12">
                    <v-select
                      label="Seleccionar roles"
                      :items="allRoles"
                      :deletable-chips="multipleRoles.length > 0"
                      v-model="multipleRoles"
                      item-text="nombre"
                      item-value="id"
                      max-height="auto"
                      :menu-props="{ offsetX: false }"
                      chips
                      multiple
                    ></v-select>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeRoles"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="saveRoles"
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>

        <v-dialog v-model="dialogEspecialidades" max-width="700">
          <template>
            <v-card max-width="700">
              <v-card-title>
                <span class="text-h5">Agregar Especialidades</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      :value="itemNombres"
                      label="Nombre Completo"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="12">
                    <v-select
                      label="Seleccionar especialidades"
                      :items="allEspecialidades"
                      :deletable-chips="multipleEspecialidades.length > 0"
                      v-model="multipleEspecialidades"
                      item-text="nombre"
                      item-value="id"
                      max-height="auto"
                      :menu-props="{ offsetX: false }"
                      chips
                      multiple
                    ></v-select>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeEspecialidades"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="saveEspecialidades"
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card-text>
            </v-card>
          </template>
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
      <!--El siguiente es un boton para crear roles-->
      <v-icon small @click="createRoles(item)">
        mdi-human-capacity-increase
      </v-icon>
      <!--El siguiente es un boton para crear roles-->
      <v-icon small @click="createEspecialidades(item)"> mdi-medal </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getPersonal"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";
import { de } from "vuetify/lib/locale";
export default {
  data: (vm) => ({
    itemNombres: "",
    allRoles: [],
    allEspecialidades: [],
    dialogRoles: false,
    dialogEspecialidades: false,
    nombreComponent: "Personal",
    dialog: false,
    dialogDelete: false,
    catalogos: [],
    generos: [],
    itemRoles: [],
    itemEspecialidades: [],
    show2: true,
    menu2: false,
    errorMessages: "",
    visibleContrasenia: true,
    tiposIdentificacion: [],
    existeIdentificacion: false,
    existeCorreo: false,
    identificacionRules: [(v) => !!v || "identificacion requerida"],
    multipleRoles: [],
    multipleEspecialidades: [],
    activoItemId: "",
    hasSaved: false,
    noSaved: false,
    itemId: null,
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
      // { text: "Roles", value: "`${roles[0].nombre} -${roles[1].nombre}`" },
      { text: "Roles", value: "rolesConcat" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    personas: [],
    personal: [],
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
    dialogRoles(val) {
      val || this.closeRoles();
    },
    dialogEspecialidades(val) {
      val || this.closeEspecialidades();
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
            console.log(result.data);
            let roles = [];
            this.personas = res;
            let rolPersona = false;
            this.personal = res.filter((item) => {
              roles = item.roles;
              if (roles.length === 0) {
                this.getAge(item.fechaNacimiento);
                item.rolesConcat = "";
                item.edad = this.edad;
                return item;
              } else {
                rolPersona = roles.some((rol) => rol.nombre !== "PACIENTE");
                if (rolPersona && item.activo) {
                  let rolesConcat = "";
                  roles.forEach((rol) => {
                    rolesConcat = rolesConcat + rol.nombre + " ";
                  });
                  this.getAge(item.fechaNacimiento);
                  item.rolesConcat = rolesConcat;
                  item.edad = this.edad;
                  return item;
                }
              }
            });

            console.log(this.personal);
            this.getCatalogos();
            this.getRoles();
            this.getEspecialidades();
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
    async getEspecialidades() {
      await axios
        .get("http://localhost:3000/api/v1/especialidades")
        .then((result) => {
          let res = result.data;
          this.allEspecialidades = res.filter((item) => item.activo == true);
          console.log(this.allEspecialidades);
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
                return item;
              }
            });
            this.generos = res.filter((item) => {
              if (item.tipo === "GENERO") {
                return item;
              }
            });
            this.tiposIdentificacion = res.filter((item) => {
              if (item.tipo === "IDENTIFICACION") {
                return item;
              }
            });
          });
      } catch (error) {
        console.log(error);
      }
    },
    editItem(item) {
      this.editedIndex = this.personal.indexOf(item);
      this.visibleContrasenia = false;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    createRoles(item) {
      this.itemNombres = item.nombres + " " + item.apellidos;
      this.itemRoles = item.roles;
      this.itemId = item.id;
      item.roles.forEach((role) => {
        this.multipleRoles.push(role);
      });
      this.dialogRoles = true;
    },
    createEspecialidades(item) {
      this.itemNombres = item.nombres + " " + item.apellidos;
      this.itemEspecialidades = item.ramas;
      this.itemId = item.id;
      item.ramas.forEach((ramas) => {
        this.multipleEspecialidades.push(ramas);
      });
      this.dialogEspecialidades = true;
    },

    deleteItem(item) {
      this.editedIndex = this.personal.indexOf(item);
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
          });
        this.personal.splice(this.editedIndex, 1);
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
    closeRoles() {
      this.dialogRoles = false;
      this.multipleRoles = [];
      this.itemRoles = [];
      this.itemId = null;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeEspecialidades() {
      this.dialogEspecialidades = false;
      this.multipleEspecialidades = [];
      this.itemEspecialidades = [];
      this.itemId = null;
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
    async saveRoles() {
      try {
        console.log("arreglo de roles nuevos:", this.multipleRoles);
        console.log("arreglo de roles anteriores:", this.itemRoles);
        let listRoles = [];
        let deleteRoles = [];
        let existeRol = true;
        let noExisteRol = true;
        this.multipleRoles.forEach((i) => {
          existeRol = this.itemRoles.some(
            (roles) =>
              roles.PersonaRol.personaId === this.itemId &&
              roles.PersonaRol.rolId == i
          );
          if (!existeRol) {
            listRoles.push({
              personaId: this.itemId,
              rolId: i,
            });
          }
        });
        this.itemRoles.forEach((role) => {
          noExisteRol = this.multipleRoles.some((i) => i === role.id);
          if (!noExisteRol) {
            deleteRoles.push(role.PersonaRol.id);
          }
        });
        console.log("arreglo de roles que se van a eliminar:", deleteRoles);
        console.log("arreglo de roles que se van a agregar:", listRoles);
        if (deleteRoles.length > 0) {
          deleteRoles.forEach(async (id) => {
            await axios
              .delete(`http://localhost:3000/api/v1/personas/deleteRol/${id}`)
              .then((result) => {
                console.log(result.data);
                this.getPersonal();
              });
          });
        }
        if (listRoles.length > 0) {
          listRoles.forEach(async (role) => {
            await axios
              .post("http://localhost:3000/api/v1/personas/add-rol", role)
              .then((result) => {
                console.log(result.data);
                this.getPersonal();
              });
          });
        }
        this.dialogRoles = false;
      } catch (error) {
        console.log(error.message);
      }
    },
    async saveEspecialidades() {
      try {
        console.log("arreglo de roles nuevos:", this.multipleEspecialidades);
        console.log("arreglo de roles anteriores:", this.itemEspecialidades);
        let listEspecialidades = [];
        let deleteEspecialidades = [];
        let existeEspecialidad = true;
        let noExisteEspecialidad = true;
        this.multipleEspecialidades.forEach((i) => {
          existeEspecialidad = this.itemEspecialidades.some(
            (especialidad) =>
              especialidad.PersonaEspecialidad.personaId === this.itemId &&
              especialidad.PersonaEspecialidad.especialidadId == i
          );
          if (!existeEspecialidad) {
            listEspecialidades.push({
              personaId: this.itemId,
              especialidadId: i,
            });
          }
        });
        this.itemEspecialidades.forEach((especialidad) => {
          noExisteEspecialidad = this.multipleEspecialidades.some(
            (i) => i === especialidad.id
          );
          if (!noExisteEspecialidad) {
            deleteEspecialidades.push(especialidad.PersonaEspecialidad.id);
          }
        });
        console.log(
          "arreglo de roles que se van a eliminar:",
          deleteEspecialidades
        );
        console.log(
          "arreglo de roles que se van a agregar:",
          listEspecialidades
        );
        if (deleteEspecialidades.length > 0) {
          deleteEspecialidades.forEach(async (id) => {
            await axios
              .delete(
                `http://localhost:3000/api/v1/personas/deleteEspecialidad/${id}`
              )
              .then((result) => {
                console.log(result.data);
                this.getPersonal();
              });
          });
        }
        if (listEspecialidades.length > 0) {
          listEspecialidades.forEach(async (especialidad) => {
            await axios
              .post(
                "http://localhost:3000/api/v1/personas/add-especialidad",
                especialidad
              )
              .then((result) => {
                console.log(result.data);
                this.getPersonal();
              });
          });
        }
        this.dialogEspecialidades = false;
      } catch (error) {
        console.log(error.message);
      }
    },
    async save() {
      try {
        if (this.editedIndex > -1) {
          let idPersonal = this.personal[this.editedIndex].id;
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
          await axios
            .patch(
              `http://localhost:3000/api/v1/personas/${idPersonal}`,
              this.editedItem
            )
            .then((result) => {
              this.editedItem = result.data;
              delete this.editedItem.ramas;
              Object.assign(this.personal[this.editedIndex], this.editedItem);
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
          console.log(this.editedItem);
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
                this.personal.push(this.editedItem);
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