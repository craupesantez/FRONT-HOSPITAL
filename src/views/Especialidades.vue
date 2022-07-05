<template>
  <v-data-table
    :headers="headers"
    :items="especialidades"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Especialidades</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nueva Especialidad
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.nombre"
                    :rules="[
                      () =>
                        !!editedItem.nombre || 'El nombre es requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Nombre"
                    required
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-checkbox
                    v-model="editedItem.activo"
                    :label="`Estado`"
                  ></v-checkbox>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.usuarioRegistro"
                    :rules="[
                      () =>
                        !!editedItem.usuarioRegistro || 'El usuario es requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Registrado por:"
                    disabled
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.usuarioActualizo"
                    :rules="[
                      () =>
                        !!editedItem.usuarioActualizo || 'El usuario es requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Actualizado por:"
                    disabled
                    outlined
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >¿Estas seguro de que quieres eliminar  {{ nombreComponent }} ?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
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
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getEspecialidades"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";
export default {
  data: (vm) => ({
    nombreComponent:"Especialidad",
    dialog: false,
    dialogDelete: false, 
    errorMessages: "",
    activoItemId: "",
    username:"",
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nombre", value: "nombre" },
      { text: "Activo", value: "activo" },
      { text: "Registrado por:", value: "usuarioRegistro" },
      { text: "Actualizado por:", value: "usuarioActualizo" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    especialidades: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      activo: true,
      usuarioRegistro: localStorage.getItem("username").replace('"','').replace('"',''),
      usuarioActualizo: localStorage.getItem("username").replace('"','').replace('"','')
    },
    defaultItem: {
      nombre: "",
      activo: true,
       usuarioRegistro: localStorage.getItem("username").replace('"','').replace('"',''),
       usuarioActualizo: localStorage.getItem("username").replace('"','').replace('"','')
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Especialidad" : "Editar Especialidad";
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
    async getEspecialidades() {
      try {
        this.username = localStorage.getItem("username");
        await axios.get("http://localhost:3000/api/v1/especialidades").then((result) => {
          // this.catalogos = result.data;
          let res = result.data;
          this.especialidades = res.filter((item) => item.activo === true);
          console.log(this.especialidades);
        });
      } catch (error) {
        console.log(error);
      }
    },
    editItem(item) {
      console.log(item.id);
      console.log(this.especialidades.indexOf(item));
      this.editedIndex = this.especialidades.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.especialidades.indexOf(item);
      this.activoItemId = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        let especialidadDeleteId;
        await axios
          .delete(`http://localhost:3000/api/v1/especialidades/${this.activoItemId}`)
          .then((result) => {
            especialidadDeleteId = result.data;
            console.log(especialidadDeleteId);
          });
        this.especialidades.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.log(error);
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      try {
        if (this.editedIndex > -1) {
          let idEspecialidad = this.especialidades[this.editedIndex].id;
          delete this.editedItem.id;
          delete this.editedItem.usuarioRegistro;
          delete this.editedItem.fechaRegistro;
          await axios
            .patch(
              `http://localhost:3000/api/v1/especialidades/${idEspecialidad}`,
              this.editedItem
            )
            .then((result) => {
              this.editedItem = result.data;
              Object.assign(this.especialidades[this.editedIndex], this.editedItem);
            });
        } else {
          this.editItem.usuarioRegistro= this.username;
          this.editItem.usuarioActualizo = this.username;
          await axios
            .post("http://localhost:3000/api/v1/especialidades", this.editedItem)
            .then((result) => {
              this.editedItem = result.data;
              if (this.editedItem !== null) {
                this.especialidades.push(this.editedItem);
                this.getEspecialidades();
              }
            });
        }
        this.close();
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getEspecialidades();
  },
};
</script>