<template>
  <v-data-table
    :headers="headers"
    :items="pedidos"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Pedidos Examenes</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" v-show="enableCUD">
              Nuevo Pedido
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
                  <v-autocomplete
                    v-model="editedItem.examen"
                    item-value="examenId"
                    :items="examenes"
                    :filter="customFilter"
                    color="accent"
                    item-text="nombre"
                    label="Examen"
                    required
                    :rules="selectRules"
                    return-object
                    no-data-text="No existen examenes"
                    outlined
                  ></v-autocomplete>
                <!-- </v-col> -->
                <!-- <v-col class="d-flex" cols="12" sm="6"> -->
                  <v-text-field
                    v-model="editedItem.resultado"
                    :rules="[
                      () =>
                        !!editedItem.resultado ||
                        'Los requisitos son requerido',
                    ]"
                    :error-messages="errorMessages"
                    color="accent"
                    label="Resultado"
                    required
                    outlined
                  >
                  </v-text-field>
                <!-- </v-col> -->
              <!-- </v-row> -->
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
      <v-btn color="primary" @click="getPedidos"> Reset </v-btn>
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
      { text: "Examen", value: "nombreExamen" },
      { text: "resultado", value: "resultado" },
      //   { text: "Activo", value: "activo" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    pedidos: [],
    examenes: [],
    citas: [],
    idCita:null,
    editedIndex: -1,
    selectRules: [(v) => !!v || "Es requerido"],
    editedItem: {
      cita:[],
      examen: [],
      resultado: "",
    },
    defaultItem: {
      cita: [],
      examen: [],
      resultado: "",
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
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Pedido" : "Editar Pedido";
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
    async getPedidos() {
      try {
        this.idCita =this.$store.state.idCita;
        console.log("idCita: " + this.idCita);
        await axios
          .get("http://localhost:3000/api/v1/citas/pedidos")
          .then((result) => {
            // this.catalogos = result.data;
            let res = result.data;
            // this.pedidos= res;
            this.pedidos = res.filter(item=>{
              if(item.citaId === this.idCita){
                this.examenes.forEach((examen)=>{
                  if(examen.id === item.examenId){
                    item.nombreExamen = examen.nombre;
                  }
                });  
                return item;
              }
            });
            console.log("pedidos prueba: " , this.pedidos);
          });
      } catch (error) {
        console.log(error);
      }
    },

    async getExamenes() {
      try {
        await axios
          .get("http://localhost:3000/api/v1/examenes")
          .then((result) => {
            // this.catalogos = result.data;
            let res = result.data;
            this.examenes = res.filter((item) => {
              if(item.activo === true){
                item.examenId= item.id;
                return item;
              }
              });
            console.log(this.examenes);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getCitas() {
      try {
        await axios.get("http://localhost:3000/api/v1/citas").then((result) => {
          let res = result.data;
          this.citas = res.filter((item)=>{
            item.citaId = item.id; 
          });
          console.log(this.citas);
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
      this.editedIndex = this.pedidos.indexOf(item);
      this.editedItem ={
        cita: {citaId: item.citaId},
        examen: {examenId: item.examenId},
        id: item.id,
        resultado: item.resultado,
      };
      console.log(this.editedItem);
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

    defaultPedidoHijo(value){
      if(value){
        this.getPedidos();
      }else{
        this.pedidos=[];
      }
      
    },
    async save() {
      try {
        if (this.editedIndex > -1) {
          let idPedido = this.pedidos[this.editedIndex].id;
          delete this.editedItem.id;
          let editExamen;
          if(this.editedItem.resultado){
            editExamen ={
              citaId: this.editedItem.cita.citaId,
              examenId: this.editedItem.examen.examenId,
              resultado: this.editedItem.resultado
            };
          }else{
            editExamen ={
              citaId: this.editedItem.cita.citaId,
              examenId: this.editedItem.examen.examenId,
            };
          }
          
          await axios
            .patch(
              `http://localhost:3000/api/v1/citas/update-examen/${idPedido}`,
              editExamen
            )
            .then((result) => {
              this.editedItem = result.data;
              this.getPedidos();
              Object.assign(this.pedidos[this.editedIndex], this.editedItem);
            });
        } else {
          let newPedido;
          if (this.editedItem.resultado) {
            newPedido = {
              citaId: this.idCita,
              examenId: this.editedItem.examen.id,
              resultado: this.editedItem.resultado,
            };
            console.log(newPedido);
          }else{
            newPedido = {
              citaId: this.idCita,
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
    this.getExamenes();
    this.getCitas();
    this.getPedidos();
  },
};
</script>