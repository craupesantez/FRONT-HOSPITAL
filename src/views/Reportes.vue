<template>
  <v-card>
    <v-tabs color="deep-purple accent-4" right>
      <v-tab>CALIFICACIÓN DE CITAS MÉDICAS</v-tab>
      <v-tab>RESUMEN DE PACIENTES Y PROMEDIO</v-tab>

      <v-tab-item>
        <v-container fluid>
          <v-btn color="primary" dark class="mb-2" @click="getCalificacionPDF">
            PDF
          </v-btn>
          <div>
            <v-data-table
              :headers="headers"
              :items="detalleCalificacion"
              class="elevation-1"
              id="calificaciones-citas"
            >
            </v-data-table>
          </div>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-container fluid>
            <v-btn color="primary" dark class="mb-2" @click="getPromedioPDF">
            PDF
          </v-btn>
          <div>
            <v-data-table
              :headers="headers2"
              :items="ResumenPromedio"
              class="elevation-1"
              id="promedio"
            >
            </v-data-table>
          </div>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
  <script>
import axios from "axios";
 import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
export default {
  data: (vm) => ({
    headers: [
      {
        text: "Id Cita",
        align: "start",
        sortable: true,
        value: "id",
      },
      { text: "Apellidos y nombres del medico", value: "nombreCompleto" },
      { text: "Id del Paciente", value: "pacienteId" },
      { text: "Fecha de atención", value: "fechaInicio" },
      { text: "Calificación", value: "calificacion" },
    ],
    headers2: [
      {
        text: "Id Medico",
        align: "start",
        sortable: true,
        value: "id",
      },
      { text: "Apellidos y nombres del medico", value: "nombreCompleto" },
      { text: "Numero de pacientes atendidos", value: "atenciones" },
      { text: "promedio", value: "promedio" },
    ],
    citas: [],
    detalleCalificacion: [],
    ResumenPromedio: [],
  }),
  methods: {
    getColor(calories) {
      if (calories > 400) return "red";
      else if (calories > 200) return "orange";
      else return "green";
    },
    async getCitas() {
      try {
        axios.get("http://localhost:3000/api/v1/citas").then((result) => {
          let res = result.data;
          this.citas = res;
          console.log(this.citas);
          this.citas.map((item) => {
            this.detalleCalificacion.push({
              id: item.id,
              nombreCompleto: item.medico.apellidos + " " + item.medico.nombres,
              pacienteId: item.pacienteId,
              fechaInicio: item.fechaInicio,
              calificacion: item.calificacion,
            });
          });
          console.log(this.detalleCalificacion);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getPromedios() {
      try {
        axios.get("http://localhost:3000/api/v1/citas/get-promedio").then((result) => {
          let res = result.data;
          console.log(res);
          res.map((item) => {
            this.ResumenPromedio.push({
              id: item.medicoId,
              nombreCompleto: item.medico.apellidos + " " + item.medico.nombres,
              atenciones: item.atenciones,
              promedio: parseFloat(item.promedio).toFixed(1)// item.promedio.toFixed(1),
            });
          });
          console.log(this.ResumenPromedio);
        });
      } catch (error) {
        console.log(error);
      }
    },
    getCalificacionPDF() {
      var element = document.getElementById("calificaciones-citas");
      var opt = {
        margin: 1,
        filename: 'calificaciones.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
      };
      html2pdf(element, opt);

    },
    getPromedioPDF() {
      var element = document.getElementById("promedio");
      var opt = {
        margin: 1,
        filename: 'promedios.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' },
      };
      html2pdf(element, opt);

    },
  },
  created() {
    this.getCitas();
    this.getPromedios();
  },
};
</script>