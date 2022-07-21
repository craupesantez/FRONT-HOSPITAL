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
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" v-show="enableCUD">
              Nuevo Receta
            </v-btn>
          </template>
          <v-card>
            <v-toolbar flat color="info darken-1">
              <v-toolbar-title class="font-weight-light">
                {{ formTitle }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
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
                    no-data-text="No existen examenes"
                    outlined
                    class="mt-2"
                  ></v-autocomplete>
                <!-- </v-col>
                <v-col class="d-flex" cols="12" sm="6"> -->
                  <v-text-field
                    v-model="editedItem.indicaciones"
                    :rules="[
                      () =>
                        !!editedItem.indicaciones ||
                        'Los requisitos son requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Indicaciones"
                    required
                    outlined
                  >
                  </v-text-field>
                  <v-text-field
                    v-model="editedItem.cantidad"
                    hide-details
                    single-line
                    label="Cantidad"
                    required
                    outlined
                    type="number"
                  ></v-text-field>
                <!-- </v-col>
              </v-row> -->
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
      <v-icon small class="mr-2" @click="editItem(item)" v-show="enableCUD"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)" v-show="enableCUD"> mdi-delete </v-icon>
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
      { text: "Medicamento", value: "nombreMedicamento" },
      { text: "Indicaciones", value: "indicaciones" },
        { text: "Cantidad", value: "cantidad" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    recetas: [],
    medicamentos: [],
    citas: [],
    idCita:null,
    editedIndex: -1,
    selectRules: [(v) => !!v || "Es requerido"],
    editedItem: {
      cita:[],
      medicamento: [],
      indicaciones: "",
      cantidad: 1
    },
    defaultItem: {
       cita:[],
      medicamento: [],
      indicaciones: "",
      cantidad: 1
    },
    statesRoles: [],
    isAdministrador: false,
    isPaciente: false,
    isMedico: false,
    isAuxiliar: false,
    enableCUD: false,
  }),
  mounted() {
    this.getCitas();
    this.getMedicamentos();
    this.getRecetas();
  },
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
        this.idCita =this.$store.state.idCita;
        await axios
          .get("http://localhost:3000/api/v1/citas/recetas")
          .then((result) => {
            // this.catalogos = result.data;
            let res = result.data;
            this.recetas = res.filter(item=>{
              if(item.citaId === this.idCita){
                this.medicamentos.forEach((medicamento)=>{
                  if(medicamento.id === item.medicamentoId){
                    item.nombreMedicamento = medicamento.nombre;
                  }
                });
                console.log(item);
                return item;
              }
            });
            console.log("pedidos prueba: " , this.recetas);
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
            this.medicamentos = res.filter((item) => {
              if(item.activo === true){
                item.medicamentoId= item.id;
                return item;
              }
              });
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
          this.citas = res.filter((item)=>{
            item.citaId = item.id; 
          });
        });
      } catch (error) {
        console.log(error);
      }
    },

    customFilter(item, queryText, itemText) {
      const textOne = item.nombre.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    editItem(item) {
      this.editedIndex = this.recetas.indexOf(item);
       this.editedItem ={
        cita: {citaId: item.citaId},
        medicamento: {medicamentoId: item.medicamentoId},
        id: item.id,
        indicaciones: item.indicaciones,
        cantidad: item.cantidad,
      };
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.recetas.indexOf(item);
      this.activoItemId = item.id;
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        let recetaDeleteId;
        await axios
          .delete(
            `http://localhost:3000/api/v1/citas/delete-pedido/${this.activoItemId}`
          )
          .then((result) => {
            recetaDeleteId = result.data;
            console.log(recetaDeleteId);
          });
        this.recetas.splice(this.editedIndex, 1);
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

    defaultRecetaHijo(value){
      if(value){
        this.getRecetas();
      }else{
        this.recetas=[];
      }
      
    },
    async save() {
      try {
        if (this.editedIndex > -1) {
          let idPedido = this.recetas[this.editedIndex].id;
          delete this.editedItem.id;
          let editMedicamento ={
            citaId: this.editedItem.cita.citaId,
            medicamentoId: this.editedItem.medicamento.medicamentoId,
            indicaciones: this.editedItem.indicaciones,
            cantidad : this.editedItem.cantidad,
          };
          await axios
            .patch(
              `http://localhost:3000/api/v1/citas/update-medicamento/${idPedido}`,
              editMedicamento
            )
            .then((result) => {
              this.editedItem = result.data;
              Object.assign(this.recetas[this.editedIndex], this.editedItem);
            });
        } else {
          let newPedido = {
              citaId: this.idCita,
              medicamentoId: this.editedItem.medicamento.id,
              indicaciones: this.editedItem.indicaciones,
              cantidad: this.editedItem.cantidad,
            };
          await axios
            .post("http://localhost:3000/api/v1/citas/add-medicamento", newPedido)
            .then((result) => {
              this.editedItem = result.data;
              if (this.editedItem !== null) {
                this.recetas.push(this.editedItem);
                this.getRecetas();
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
    this.statesRoles = this.$store.state.roles;
    this.idPersona = this.$store.state.id;
    this.isAdministrador = this.statesRoles.some(
      (item) => item.nombre == "ADMINISTRADOR"
    );
    this.isPaciente = this.statesRoles.some(
      (item) => item.nombre == "PACIENTE"
    );
    this.isMedico = this.statesRoles.some((item) => item.nombre == "MEDICO");
    this.isAuxiliar = this.statesRoles.some(
      (item) => item.nombre == "AUXILIAR"
    );
    if(this.isPaciente &&
      !this.isAdministrador &&
      !this.isMedico &&
      !this.isAuxiliar){
        this.enableCUD = false;
      }else{
        this.enableCUD = true;
      }
    this.getRecetas();
    this.getMedicamentos();
    this.getCitas();
  },
};
</script>