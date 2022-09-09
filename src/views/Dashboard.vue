<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="3">
        <v-card max-width="400">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5"> Pacientes </v-list-item-title>
              <!-- <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <v-row>
              <v-col class="text-h2" cols="5"> {{ pacientes.length }} </v-col>
              <v-col cols="5">
                <v-img
                  src="https://cdn.icon-icons.com/icons2/2266/PNG/512/patient_icon_140481.png"
                  alt="Sunny image"
                  width="92"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text> Full Report </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card max-width="400">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5"> Médicos </v-list-item-title>
              <!-- <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <v-row>
              <v-col class="text-h2" cols="5"> {{ medicos.length }} </v-col>
              <v-col cols="5">
                <v-img
                  src="https://cdn.icon-icons.com/icons2/2362/PNG/512/medical_medicine_doctor_hospital_icon_143393.png"
                  alt="Sunny image"
                  width="92"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text> Full Report </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card max-width="400">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5">
                Especialidades
              </v-list-item-title>
              <!-- <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <v-row>
              <v-col class="text-h2" cols="5">
                {{ especialidades.length }}
              </v-col>
              <v-col cols="5">
                <v-img
                  src="https://png.pngtree.com/png-vector/20200113/ourmid/pngtree-support-phone-operator-in-headset-icons-set-png-image_2115782.jpg"
                  alt="Sunny image"
                  width="92"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text> Full Report </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card max-width="400">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5"> Citas </v-list-item-title>
              <!-- <v-list-item-subtitle>Mon, 12:30 PM, Mostly sunny</v-list-item-subtitle> -->
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <v-row>
              <v-col class="text-h2" cols="5"> {{ citas.length }} </v-col>
              <v-col cols="5">
                <v-img
                  src="https://cdn.icon-icons.com/icons2/1494/PNG/512/appointment_102882.png"
                  alt="Sunny image"
                  width="92"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn text> Full Report </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="6">
        <Bar
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
//import { Bar } from 'vue-chartjs';
import { Bar } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },
  data: (vm) => ({
    chartData: {
      //labels: ["January", "February", "March"],
      labels: [],
      ids: [],
      datasets: [{ data: [1, 2, 1, 0] }],
    },
    chartOptions: {
      responsive: true,
    },
    pacientes: [],
    medicos: [],
    persona: [],
    especialidades: [],
    citas: [],
    examenes: [],
    citasPorEspecialidad: [],
  }),
  created() {
    this.getPacientes();
    this.getMedicos();
    this.getEspecialidades();
    this.getCitas();
    this.getExamenes();
    this.getCitasByEspecialidad(); 
  },
  methods: {
    async getPacientes() {
      try {
        axios
          .get("http://localhost:3000/api/v1/personas/pacientes")
          .then((result) => {
            let res = result.data;
            this.pacientes = res;
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getMedicos() {
      try {
        axios
          .get("http://localhost:3000/api/v1/personas/medicos")
          .then((result) => {
            let res = result.data;
            this.medicos = res;
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
            let res = result.data;
            this.especialidades = res;
            this.chartData.labels =  this.especialidades.map(item => item.nombre);
            this.chartData.ids =  this.especialidades.map(item => item.id);
            //console.log(listEspecialidades);
            
            console.log(this.chartData);
          });
      } catch (error) {
        console.log(error);
      }
    },
    async getCitas() {
      try {
        axios.get("http://localhost:3000/api/v1/citas").then((result) => {
          let res = result.data;
          this.citas = res;
          console.log(this.citas);
          this.citas
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getCitasByEspecialidad() {
      try {
        axios.get("http://localhost:3000/api/v1/citas/citas-by-especialidad").then((result) => {
          let res = result.data;
          this.citasPorEspecialidad = res;
          console.log(this.citasPorEspecialidad);
          this.chartData.datasets[0].data =  this.citasPorEspecialidad.map(item=>item.total);

        });
      } catch (error) {
        console.log(error);
      }
    },
    async getExamenes() {
      try {
        axios.get("http://localhost:3000/api/v1/examenes").then((result) => {
          let res = result.data;
          this.examenes = res;
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>