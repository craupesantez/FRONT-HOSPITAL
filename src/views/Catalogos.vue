<template>
  <v-data-table
    :headers="headers"
    :items="catalogos"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Catalogos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Catalogo
            </v-btn>
          </template>
          <v-card>
            <v-toolbar flat color="info darken-1">
              <v-icon>mdi-clipboard-list-outline</v-icon>
              <v-toolbar-title class="font-weight-light">
                {{ formTitle }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="d-flex mt-2" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.tipo"
                    :rules="[
                      () =>
                        !!editedItem.tipo || 'El tipo es requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Tipo"
                    required
                    outlined
                  >
                  </v-text-field>
                </v-col>
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
                <v-col class="d-flex" cols="12" sm="6">
                  <v-checkbox
                    v-model="editedItem.activo"
                    :label="`Estado`"
                  ></v-checkbox>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.descripcion"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Descripción"
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.padre"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Padre"
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
      <v-btn color="primary" @click="getCatalogos"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";
export default {
  data: (vm) => ({
    nombreComponent:"Catalogo",
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
      { text: "Tipo de catalogo", value: "tipo" },
      { text: "Nombre", value: "nombre" },
      { text: "Activo", value: "activo" },
      { text: "Descripción", value: "descripcion" },
      { text: "padre", value: "padre" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    catalogos: [],
    editedIndex: -1,
    editedItem: {
      tipo: null,
      nombre: null,
      activo: true,
      descripcion: null,
      padre: null,
    },
    defaultItem: {
      tipo: null,
      nombre: null,
      activo: true,
      descripcion: null,
      padre:null,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva Catalogo" : "Editar Catalogo";
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
    async getCatalogos() {
      try {
        //this.username = localStorage.getItem("username");
        await axios.get("http://localhost:3000/api/v1/catalogos").then((result) => {
          // this.catalogos = result.data;
          let res = result.data;
          this.catalogos = res.filter((item) => item.activo === true);
          console.log(this.catalogos);
        });
      } catch (error) {
        console.log(error);
      }
    },
    editItem(item) {
      console.log(item.id);
      console.log(this.catalogos.indexOf(item));
      this.editedIndex = this.catalogos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.catalogos.indexOf(item);
      this.activoItemId = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        let catalogoDeleteId;
        await axios
          .delete(`http://localhost:3000/api/v1/catalogos/${this.activoItemId}`)
          .then((result) => {
            catalogoDeleteId = result.data;
            console.log(catalogoDeleteId);
          });
        this.catalogos.splice(this.editedIndex, 1);
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
          let idCatalogo = this.catalogos[this.editedIndex].id;
          delete this.editedItem.id;
          if(this.editedItem.descripcion=== null)  delete this.editedItem.descripcion; 
          if(this.editedItem.padre=== null) delete this.editedItem.padre;
          if(this.editedItem.personas=== null) delete this.editedItem.personas;
          console.log("imprimir registro a guardar",this.editedItem)     
          await axios
            .patch(
              `http://localhost:3000/api/v1/catalogos/${idCatalogo}`,
              this.editedItem
            )
            .then((result) => {
              this.editedItem = result.data;
              delete this.editedItem.personas;
              console.log("imprimir registro de respuesta:",this.editedItem)
              Object.assign(this.catalogos[this.editedIndex], this.editedItem);
            });
        } else {
          if(this.editedItem.descripcion === null) {
            console.log("ingreso: " + this.editedItem.descripcion);
            delete this.editedItem.descripcion;
          }  
          if(this.editedItem.padre === null) {
            console.log("ingreso: " + this.editedItem.descripcion);
            delete this.editedItem.padre;
          }
          console.log(this.editedItem)
          await axios
            .post("http://localhost:3000/api/v1/catalogos", this.editedItem)
            .then((result) => {
              this.editedItem = result.data;
              if (this.editedItem !== null) {
                this.catalogos.push(this.editedItem);
                this.getCatalogos();
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
    this.getCatalogos();
  },
};
</script>