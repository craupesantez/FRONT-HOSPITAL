<template>
  <v-data-table
    :headers="headers"
    :items="roles"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Roles</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Rol
            </v-btn>
          </template>
          <v-card>
            <v-toolbar flat color="info darken-1">
              <v-icon>mdi-human-capacity-increase</v-icon>
              <v-toolbar-title class="font-weight-light">
                {{ formTitle }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="d-flex mt-2" cols="12" sm="6">
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
                <v-col class="d-flex mt-2" cols="12" sm="6">
                  <v-checkbox
                    v-model="editedItem.activo"
                    :label="`Estado`"
                  ></v-checkbox>
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
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getRoles"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";
export default {
  data: (vm) => ({
    nombreComponent:"Rol",
    dialog: false,
    dialogDelete: false, 
    errorMessages: "",
    activoItemId: "",
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nombre", value: "nombre" },
      { text: "Activo", value: "activo" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    roles: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      activo: true,
    },
    defaultItem: {
      nombre: "",
      activo: true,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Rol" : "Editar Rol";
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
    async getRoles() {
      try {
        await axios.get("http://localhost:3000/api/v1/roles").then((result) => {
          // this.catalogos = result.data;
          let res = result.data;
          this.roles = res.filter((item) => item.activo === true);
          console.log(this.roles);
        });
      } catch (error) {
        console.log(error);
      }
    },
    editItem(item) {
      console.log(item.id);
      console.log(this.roles.indexOf(item));
      this.editedIndex = this.roles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.roles.indexOf(item);
      this.activoItemId = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        let rolDeleteId;
        await axios
          .delete(`http://localhost:3000/api/v1/roles/${this.activoItemId}`)
          .then((result) => {
            rolDeleteId = result.data;
            console.log(rolDeleteId);
          });
        this.roles.splice(this.editedIndex, 1);
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
          let idRol = this.roles[this.editedIndex].id;
          delete this.editedItem.id;
          await axios
            .patch(
              `http://localhost:3000/api/v1/roles/${idRol}`,
              this.editedItem
            )
            .then((result) => {
              this.editedItem = result.data;
              Object.assign(this.roles[this.editedIndex], this.editedItem);
            });
        } else {
          await axios
            .post("http://localhost:3000/api/v1/roles", this.editedItem)
            .then((result) => {
              this.editedItem = result.data;
              if (this.editedItem !== null) {
                this.roles.push(this.editedItem);
                this.getRoles();
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
    this.getRoles();
  },
};
</script>