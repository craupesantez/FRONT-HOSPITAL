<template>
  <v-data-table
    :headers="headers"
    :items="recetas"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Recetas</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Pedido
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.cita"
                    item-value="citaId"
                    :items="citas"
                    :filter="customFilter"
                    color="accent"
                    item-text="id"
                    label="Cita"
                    required
                    :rules="selectRules"
                    return-object
                    no-data-text="No existen citas"
                    outlined
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-autocomplete
                    v-model="editedItem.medicamento"
                    item-value="medicamentoId"
                    :items="medicamentos"
                    :filter="customFilter"
                    color="accent"
                    item-text="nombre"
                    label="Medicamento"
                    required
                    :rules="selectRules"
                    return-object
                    no-data-text="No existen medicamentos"
                    outlined
                  ></v-autocomplete>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.indicaciones"
                    :rules="[
                      () =>
                        !!editedItem.resultado ||
                        'Los requisitos son requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Indicaciones"
                    required
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.cantidad"
                    :rules="[
                      () =>
                        !!editedItem.resultado ||
                        'Los requisitos son requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Cantidad"
                    required
                    outlined
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
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getRecetas"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";
export default {
  data: (vm) => ({
    nombreComponent: "Examen",
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
      { text: "N° Cita", value: "citaId" },
      { text: "N° medicamento", value: "medicamentoId" },
      { text: "Indicaciones", value: "indicaciones" },
        { text: "Cantidad", value: "cantidad" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    recetas: [],
    medicamentos: [],
    citas: [],
    editedIndex: -1,
    selectRules: [(v) => !!v || "Paciente requerido"],
    editedItem: {
      cita: [],
      medicamento: [],
      indicaciones: "",
      cantidad:0
    },
    defaultItem: {
      cita: [],
      medicamento: [],
      indicaciones: "",
      cantidad:0
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Medicamento" : "Editar Medicamento";
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
    async getRecetas() {
      try {
        await axios
          .get("http://localhost:3000/api/v1/citas/recetas")
          .then((result) => {
            // this.catalogos = result.data;
            let res = result.data;
            this.recetas = res;
            console.log(this.recetas);
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getMedicamentos() {
      try {
        await axios
          .get("http://localhost:3000/api/v1/medicamentos")
          .then((result) => {
            // this.catalogos = result.data;
            let res = result.data;
            this.medicamentos = res.filter((item) => item.activo === true);
            console.log(this.medicamentos);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getCitas() {
      try {
        await axios.get("http://localhost:3000/api/v1/citas").then((result) => {
          // this.catalogos = result.data;
          let res = result.data;
          this.citas = res;
          console.log(this.citas);
        });
      } catch (error) {
        console.log(error);
      }
    },

    customFilter(item, queryText, itemText) {
      const textOne = item.id.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    editItem(item) {
      console.log(item.id);
      console.log(this.pedidos.indexOf(item));
      this.editedIndex = this.pedidos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.pedidos.indexOf(item);
      this.activoItemId = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        let pedidoDeleteId;
        await axios
          .delete(
            `http://localhost:3000/api/v1/citas/delete-pedido/${this.activoItemId}`
          )
          .then((result) => {
            pedidoDeleteId = result.data;
            console.log(pedidoDeleteId);
          });
        this.pedidos.splice(this.editedIndex, 1);
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
          let idPedido = this.pedidos[this.editedIndex].id;
          delete this.editedItem.id;
          await axios
            .patch(
              `http://localhost:3000/api/v1/citas/update-examen/${idPedido}`,
              this.editedItem
            )
            .then((result) => {
              this.editedItem = result.data;
              Object.assign(this.pedidos[this.editedIndex], this.editedItem);
            });
        } else {
          let newPedido;
          if (this.editedItem.resultado) {
            newPedido = {
              citaId: this.editedItem.cita.id,
              examenId: this.editedItem.examen.id,
              resultado: this.editedItem.resultado,
            };
            console.log(newPedido);
          }else{
            newPedido = {
              citaId: this.editedItem.cita.id,
              examenId: this.editedItem.examen.id,
            };
          }
          await axios
            .post("http://localhost:3000/api/v1/citas/add-examen", newPedido)
            .then((result) => {
              this.editedItem = result.data;
              if (this.editedItem !== null) {
                this.pedidos.push(this.editedItem);
                this.getPedidos();
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
    this.getRecetas();
    this.getMedicamentos();
    this.getCitas();
  },
};
</script>