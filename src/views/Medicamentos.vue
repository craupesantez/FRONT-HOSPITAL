<template>
  <v-data-table
    :headers="headers"
    :items="medicamentos"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Medicamentos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Medicamento
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
                      () => !!editedItem.nombre || 'El nombre es requerido',
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
                  <v-text-field
                    v-model="editedItem.descripcion"
                    :rules="[
                      () =>
                        !!editedItem.descripcion ||
                        'La descripción es requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Descripción"
                    required
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.advertencia"
                    :rules="[
                      () =>
                        !!editedItem.advertencia ||
                        'La advertencia son requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Advertencia"
                    required
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.dosis"
                    :rules="[
                      () => !!editedItem.dosis || 'La dosis es requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Dosis"
                    required
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.costoUnidad"
                    prefix="$"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Costo unidad"
                    required
                    outlined
                  >
                  </v-text-field>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.costoCaja"
                    prefix="$"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Costo caja"
                    required
                    outlined
                  >
                  </v-text-field>
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
                        v-model="editedItem.fechaVencimiento"
                        label="Fecha de vencimiento"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        required
                        outlined
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editedItem.fechaVencimiento"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="d-flex" cols="12" sm="6">
                  <v-checkbox
                    v-model="editedItem.activo"
                    :label="`Estado`"
                  ></v-checkbox>
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
      <v-btn color="primary" @click="getMedicamentos"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import axios from "axios";
export default {
  data: (vm) => ({
    nombreComponent: "Medicamentos",
    dialog: false,
    dialogDelete: false,
    errorMessages: "",
    activoItemId: "",
    menu2: false,
    fechaVencimiento: new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10),
    dateFormatted: vm.formatDate(
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    ),
    headers: [
      {
        text: "Id",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Nombre", value: "nombre" },
      { text: "Descripción", value: "descripcion" },
      { text: "Advertencia", value: "advertencia" },
      { text: "Dosis", value: "dosis" },
      { text: "Costo Unidad", value: "costoUnidad" },
      { text: "Costo Caja", value: "costoCaja" },
      { text: "Fecha de Vencimiento", value: "fechaVencimiento" },
      { text: "Activo", value: "activo" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    medicamentos: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      activo: true,
      fechaVencimiento: "",
    },
    defaultItem: {
      nombre: "",
      activo: true,
      fechaVencimiento: "",             
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nuevo Medicamento"
        : "Editar Medicamento";
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
    editItem(item) {
      console.log(item.id);
      console.log(this.medicamentos.indexOf(item));
      this.editedIndex = this.medicamentos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.medicamentos.indexOf(item);
      this.activoItemId = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        let medicamentoDeleteId;
        await axios
          .delete(
            `http://localhost:3000/api/v1/medicamentos/${this.activoItemId}`
          )
          .then((result) => {
            medicamentoDeleteId = result.data;
            console.log(medicamentoDeleteId);
          });
        this.medicamentos.splice(this.editedIndex, 1);
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
          let idMedicamento = this.medicamentos[this.editedIndex].id;
          delete this.editedItem.id;
          await axios
            .patch(
              `http://localhost:3000/api/v1/medicamentos/${idMedicamento}`,
              this.editedItem
            )
            .then((result) => {
              this.editedItem = result.data;
              Object.assign(
                this.medicamentos[this.editedIndex],
                this.editedItem
              );
            });
        } else {
          await axios
            .post("http://localhost:3000/api/v1/medicamentos", this.editedItem)
            .then((result) => {
              this.editedItem = result.data;
              if (this.editedItem !== null) {
                this.medicamentos.push(this.editedItem);
                this.getMedicamentos();
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
    this.getMedicamentos();
  },
};
</script>