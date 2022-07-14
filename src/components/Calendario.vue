<template>
  <div>
    <h2 class="pl-2" style="color: '#9575cd'">Citas Medicas</h2>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Hoy
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev">
              <v-icon small> mdi-chevron-left </v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next">
              <v-icon small> mdi-chevron-right </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu bottom right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right> mdi-menu-down </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Dia</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Semana</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Mes</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 días</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-dialog v-model="dialog" max-width="700px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-2"
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  fab
                  small
                  color="#1976d2"
                  icon
                >
                  <v-icon cir> mdi-plus </v-icon>
                </v-btn>
              </template>
              <v-card class="mx-auto">
                <v-card-title :class="colorS">
                  <h2 class="text-h4 white--text font-weight-light">
                    {{ formTitle }}
                  </h2>
                </v-card-title>
                
                <!-- Lo de arriba es nuevo -->
                <v-card-text>
                  <v-form ref="form" v-model="valid" lazy-validatio>
                    <v-text-field
                      type="text"
                      label="Motivo"
                      v-model="editedItem.motivo"
                      :counter="50"
                      required
                      outlined
                      class="mt-3"
                      :rules="motivoRules"
                    >
                    </v-text-field>
                    <v-text-field
                      type="text"
                      label="Detalle"
                      v-model="editedItem.detalle"
                      :counter="50"
                      required
                      outlined
                      :rules="detalleRules"
                    >
                    </v-text-field>
                    <v-autocomplete
                      v-model="editedItem.paciente"
                      item-value="pacienteId"
                      :items="pacientes"
                      :filter="customFilter2"
                      color="accent"
                      item-text="nombreCompleto"
                      label="Paciente"
                      required
                      :rules="selectRules"
                      return-object
                      no-data-text="No existen pacientes"
                      outlined
                    ></v-autocomplete>
                    <v-autocomplete
                      v-model="editedItem.especialidad"
                      item-value="especialidadId"
                      :items="especialidades"
                      :filter="customFilter"
                      color="accent"
                      item-text="nombre"
                      label="Especialidad"
                      required
                      :rules="selectRules"
                      return-object
                      no-data-text="No existen especialidades"
                      outlined
                    ></v-autocomplete>
                    <!-- agregar la siguiente propiedad si se le agrega a la especialidad el color -->
                    <!-- @change="selectEspecialidad" -->
                    <v-autocomplete
                      v-model="editedItem.medico"
                      item-value="medicoId"
                      :items="medicos"
                      :filter="customFilter2"
                      color="accent"
                      item-text="nombreCompleto"
                      label="Medico"
                      required
                      :rules="selectRules"
                      return-object
                      no-data-text="No existen medicos"
                      outlined
                    ></v-autocomplete>
                    <v-autocomplete
                      v-model="editedItem.estado"
                      item-value="estadoId"
                      :items="estados"
                      :filter="customFilter"
                      color="accent"
                      item-text="nombre"
                      label="Estados"
                      required
                      :rules="selectRules"
                      return-object
                      no-data-text="No existen estados"
                      outlined
                      v-show="enableEstado"
                    ></v-autocomplete>
                    <v-menu
                      ref="menud"
                      v-model="menud"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="timed"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.timed"
                          label="Duración Cita"
                          prepend-icon="mdi-clock-time-four-outline"
                          hint="Hora:Minuto:Segundo formato"
                          readonly
                          :rules="fraccionRequired"
                          v-bind="attrs"
                          v-on="on"
                          required
                          outlined
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menud"
                        v-model="editedItem.timed"
                        required
                        full-width
                        @click:minute="$refs.menud.save(timed)"
                        format="24hr"
                      ></v-time-picker>
                    </v-menu>

                    <v-row>
                      <v-col>
                        <v-menu
                          v-model="menu1"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.date"
                              label="Fecha de cita"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              required
                              outlined
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.date"
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col>
                        <v-menu
                          ref="menu"
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="time"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.time"
                              label="Hora Cita"
                              prepend-icon="mdi-clock-time-four-outline"
                              hint="Hora:Minuto:Segundo formato"
                              readonly
                              required
                              :rules="fraccionRequired"
                              v-bind="attrs"
                              v-on="on"
                              outlined
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu2"
                            v-model="editedItem.time"
                            full-width
                            @click:minute="$refs.menu.save(time)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    text
                    color="teal accent-4"
                    :disabled="!valid"
                    @click="guardarCita"
                  >
                    Guardar
                  </v-btn>
                  <v-btn text color="teal accent-4" @click="cerrar">
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="red"
                    icon
                    v-if="editedIndex > -1"
                    @click="deleteItem"
                  >
                    <v-icon small> mdi-delete </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Estas seguro de eliminar el registro seleccionado
                  ?</v-card-title
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
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
            locale="es-Es"
            :short-weekdays="false"
          ></v-calendar>

          <!-- Modal de agregar evento-->

          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  data: (vm) => ({
    today: new Date(),
    focus: "",
    type: "month",
    colorS: "purple lighten-2",
    menud: false,
    menu1: false,
    menu2: false,
    valid: true,
    dialogDelete: false,
    typeToLabel: {
      month: "Mes",
      week: "Semana",
      day: "Dia",
      "4day": "4 Dias",
    },
    start: null,
    end: null,
    especialidades: [],
    pacientes: [],
    medicos: [],
    persona: [],
    estados: [],
    enableEstado: false,
    timed: "01:00:00",
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("H:mm:ss"),
    selectRules: [(v) => !!v || "Paciente requerido"],
    fraccionRequired: [(v) => !!v || "Campo requerido"],
    motivoRules: [
      (v) => !!v || "El motivo  es requerido",
      (v) =>
        (v && v.length <= 50) || "El motivo debe tener menos de 51 caracteres",
    ],
    detalleRules: [
      (v) => !!v || "El detalle  es requerido",
      (v) =>
        (v && v.length <= 50) || "El detalle debe tener menos de 51 caracteres",
    ],
    defaultItem: {
      motivo: "",
      detalle: "",
      especialidad: [],
      paciente: [],
      medico: [],
      estado: [],
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("H:mm:ss"),
      timed: "01:00:00",
      fechaInicio: moment().format("YYYY-MM-DD"),
    },
    editedItem: {
      motivo: "",
      detalle: "",
      especialidad: [],
      paciente: [],
      medico: [],
      estado: [],
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("H:mm:ss"),
      timed: "01:00:00",
      fechaInicio: moment().format("YYYY-MM-DD"),
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    citas: [],
    dialog: false,
    events: [],
    motivo: null,
    detalle: null,
    color: "#1976D2",
    estados: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    names: [], //['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    details: null,
    currenetlyEditing: null,
    fechaMasFraccion: null,
    convHoraInterger: null,
    editedIndex: -1,
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  created() {
    this.getEvents();
    this.getEspecialidades();
    this.getInvolucrados();
    this.getEstados();
  },
  methods: {
    //  selectEspecialidad: function (a) {
    //   console.log("cambio");
    //   console.log(a);
    //   this.colorS = a.color;
    // },
    async guardarCita() {
      try {
        if (this.editedIndex > -1) {
          if (this.$refs.form.validate()) {
            console.log("ver events", this.events);
            console.log("ver editedIndex", this.editedIndex);
            //let citaId = this.events[this.editedIndex].id;
            let cita = {
              motivo: this.editedItem.motivo,
              detalle: this.editedItem.detalle,
              fechaInicio: moment(this.editedItem.date).format(),
              fraccion: this.editedItem.timed,
              hora: this.editedItem.time,
              estadoId: this.editedItem.estado.id,
              pacienteId: this.editedItem.paciente.id,
              medicoId: this.editedItem.medico.id,
              especialidadId: this.editedItem.especialidad.id,
            };
            console.log(cita);
            await axios
              .patch(
                `http://localhost:3000/api/v1/citas/${this.editedItem.id}`,
                cita
              )
              .then((result) => {
                this.editedItem = result.data;
                if(result.data !== null){
                    this.events=[];
                    this.getEvents();
                }
                //Object.assign(this.events[this.editedIndex], this.editedItem);
              });
          }
        } else {
          if (this.$refs.form.validate()) {
            console.log(this.editedItem);
            let estadoDefault= this.estados.filter((item) => item.nombre ==="REGISTRADA")
            console.log("item estado default: " ,estadoDefault);
            let newCita = {
              motivo: this.editedItem.motivo,
              detalle: this.editedItem.detalle,
              fechaInicio: moment(this.editedItem.date).format(),
              fraccion: this.editedItem.timed,
              hora: this.editedItem.time,
              estadoId: estadoDefault[0].id,
              pacienteId: this.editedItem.paciente.id,
              medicoId: this.editedItem.medico.id,
              especialidadId: this.editedItem.especialidad.id,
            };
            await axios
              .post("http://localhost:3000/api/v1/citas", newCita)
              .then((result) => {
                console.log(result.data);
                if(result.data !== null){
                    this.events=[];
                    this.getEvents();
                }
              });
          }
        }
        this.cerrar();
      } catch (error) {
        console.log(error);
      }
    },
    cerrar() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    openNotification(position = null, color, titulo, texto) {
      var c;
      if (color === 1) c = "primary";
      else if (color == 2) c = "danger";
      else if (color == 3) c = "success";
      else if (color == 4) c = "warn";
      else c = "rgb(59,222,200)";

      const noti = this.$vs.notification({
        progress: "auto",
        color: c,
        position,
        title: titulo,
        text: texto,
      });
      console.log(noti);
    },
    async getInvolucrados() {
      try {
        axios.get("http://localhost:3000/api/v1/personas").then((result) => {
          let res = result.data;
          let roles = [];
          this.personas = res;
          // console.log("los siguientes son las personas");
          // console.log(this.personas);
          let rolPaciente = false;
          let rolMedico = false;
          this.pacientes = res.filter((item) => {
            roles = item.roles;
            rolPaciente = roles.some((rol) => rol.nombre === "PACIENTE");
            if (rolPaciente && item.activo) {
              item.nombreCompleto = item.nombres + " " + item.apellidos;
              item.pacienteId = item.id;
              return item;
            }
          });
          this.medicos = res.filter((item) => {
            roles = item.roles;
            rolMedico = roles.some((rol) => rol.nombre === "MEDICO");
            if (rolMedico && item.activo) {
              item.nombreCompleto = item.nombres + " " + item.apellidos;
              item.medicoId = item.id;
              return item;
            }
          });
          // console.log("pacientes:", this.pacientes);
          // console.log("medicos:", this.medicos);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getEspecialidades() {
      try {
        axios
          .get("http://localhost:3000/api/v1/especialidades")
          .then((result) => {
            this.especialidades = result.data.filter((item) => {
              if (item.activo === true) {
                item.especialidadId = item.id;
                return item;
              }
            });
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getEstados() {
      try {
        axios.get("http://localhost:3000/api/v1/catalogos").then((result) => {
          this.estados = result.data.filter((item) => {
            if (item.tipo === "ESTADO_CITA" && item.activo === true) {
              item.estadoId = item.id;
              return item;
            }
          });
          // console.log("catalogos: " , this.catalogos);
        });
      } catch (error) {
        console.log(error);
      }
    },
    getConvertHoraInterger(fraccion) {
      let hora = parseInt(fraccion.substring(0, 2));
      let min = parseInt(fraccion.substring(3, 5));
      let seg = parseInt(fraccion.substring(6, 8));
      this.convHoraInterger = hora + (min + seg / 60) / 60;
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.nombre.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    customFilter2(item, queryText, itemText) {
      const textOne = item.nombreCompleto.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    async getEvents() {
      try {
        let events = [];
        await axios.get("http://localhost:3000/api/v1/citas").then((result) => {
          // console.log(result.data);
          events = result.data;
        });
        console.log(events);
        events.forEach((event) => {
          this.getConvertHoraInterger(event.fraccion);
          let hora = parseInt(event.hora.substring(0, 2));
          let min = parseInt(event.hora.substring(3, 5));

          let fechaInicio = moment(new Date(event.fechaInicio)).format(
            "YYYY-MM-DD  H:mm:ss"
          );
          let fechaIncioFormat = new Date(fechaInicio);
          fechaIncioFormat.setHours(hora, min, 0);
          let fechaMasFraccion =
            new Date(fechaIncioFormat).getTime() +
            this.convHoraInterger * 60 * 60 * 1000;
          this.events.push({
            id: event.id,
            name: event.motivo +"("+event.id+")" ,
            detalle: event.detalle,
            start: moment(fechaIncioFormat).format("YYYY-MM-DD H:mm:ss"),
            end: moment(fechaMasFraccion).format("YYYY-MM-DD H:mm:ss"),
            timed: false,
            especialidadId: event.especialidadId,
            pacienteId: event.pacienteId,
            medicoId: event.medicoId,
            date: moment(fechaIncioFormat).format("YYYY-MM-DD"),
            motivo: event.motivo,
            hora: event.hora,
            fraccion: event.fraccion,
            estadoId: event.estadoId,
            color: this.color,
          });
        });
        console.log(this.events);
      } catch (error) {
        console.log(error);
      }
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    deleteItem() {
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      /* this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }); */
    },
    async deleteItemConfirm() {
      await axios
        .delete(`http://localhost:3000/api/v1/citas/${this.editedItem.id}`)
        .then((result) => {
          if (result.data !== null) {
            console.log("dato eliminado: " + result.data);
            //  this.openNotification(
            //   "",
            //   3,
            //   "Registrado correctamente",
            //   "Estimado usuario, el registro fue exitoso"
            // );
          }
          this.closeDelete();
          this.cerrar();
        });
    },

    showEvent({ nativeEvent, event }) {
      this.enableEstado =true;
      console.log("evento click");
      console.log(event);
      this.editedIndex = event.id;
      this.editedItem = {
        motivo: event.motivo,
        detalle: event.detalle,
        especialidad: { especialidadId: event.especialidadId },
        paciente: { pacienteId: event.pacienteId },
        medico: { medicoId: event.medicoId },
        estado: { estadoId: event.estadoId },
        date: moment(event.date).format("YYYY-MM-DD"),
        time: event.hora,
        timed: event.fraccion,
        id: event.id,
      };
      console.log("valor de editedItem: ", this.editedItem);
      this.dialog = true;
      console.log(nativeEvent);
     
    },
    updateRange({ start, end }) {
     
      this.start = start;
      this.end = end;
      this.color = "#232";
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
  },
  computed: {
    formTitle() {
      this.enableEstado = this.editedIndex === -1 ? false : true;
      return this.editedIndex === -1 ? "Nueva Cita" : "Editar Cita";
    },
  },
  watch: {
    dialog(val) {
      val || this.cerrar();
    },
  },
};
</script>
