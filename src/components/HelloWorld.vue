<template>
  <v-card elevation="5" class="ml-1 mr-1 mt-1" v-scroll.self="onScroll">
    <v-row>
      <v-col>
        <v-toolbar flat color=" darken-1">
          <v-toolbar-title class="font-weight-light">
            Bienvenidos al Hospital del Oro
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          Somos más que un Centro Médico Ambulatorio, somos un Hospital de Día,
          contamos con un gran número de Especialidades Médicas, así como una de
          las Unidades de Diagnóstico por imagen con la mayor y mejor dotación
          tecnológica. Nuestros quirófanos ambulatorios realizan todo tipo de
          cirugías de diferentes especialidades que no precisen pernocta.
        </v-card-text>
      </v-col>
      <v-col>
        <v-img src="/hospitalOro.jpg" aspect-ratio="3" class="mr-2"></v-img>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-img
          src="/34-UN-Photo-Evan-Schneider.jpg"
          aspect-ratio="3"
          class="ml-2 mb-2"
        ></v-img>
      </v-col>
      <v-col>
        <v-card-text>
          Queremos preservar tu salud, para ello contamos con la Unidad de
          Chequeos Médicos con todas las especialidades necesarias y de la mano
          de los mejores especialistas para que puedas estar tranquilo. Nos
          hacemos eco de que prevenir es mejor que curar, y por ello mediante
          diferentes pruebas diagnósticas proporcionamos la mejor asistencia
          médica y seguimiento a nuestros pacientes.
        </v-card-text>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-toolbar flat color=" darken-1">
          <v-toolbar-title class="font-weight-light"> Misión </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          Hospital de día Pio XII, no somos un servicio médico, ofrecemos una
          relación directa con nuestros pacientes, les aportamos salud, pero
          también proximidad, tranquilidad, confianza y cercanía. En ello no
          perdemos la esencia de las diferentes áreas médicas, sino que las
          llevamos a cabo desde la sensación del paciente. Queremos formar parte
          de su “familia”, esa parte que les cuida y les protege desde la
          profesionalidad.
        </v-card-text>
      </v-col>
      <v-col>
        <v-toolbar flat color=" darken-1">
          <v-toolbar-title class="font-weight-light"> Visión </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          Conseguir la plena satisfacción de los pacientes anticipándonos a sus
          necesidades, asesorándoles y mejorando su salud en todos los casos.
        </v-card-text>
      </v-col>
      <v-col>
        <v-toolbar flat color=" darken-1">
          <v-toolbar-title class="font-weight-light"> Valores </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          Profesionalidad, Confianza, Proximidad, Cercanía, Orientación al
          Paciente, Innovación Tecnológica.
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => ({
    scrollInvoked: 0,
  }),
  methods: {
    onScroll() {
      this.scrollInvoked++;
    },
  },
};
</script>
