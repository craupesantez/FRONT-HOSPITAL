<template>
  <v-card elevation="5" class="ml-1 mr-1 mt-1">
    <v-carousel :show-arrows="false">
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        :src="item.src"
      ></v-carousel-item>
    </v-carousel>
  </v-card>
</template>
<script>
export default{
  data:() => ({
    items: [
          {
            src: 'https://www.redaccion.com.ar/wp-content/uploads/2020/03/Italian-hospital.jpg',
          },
          {
            src: 'https://www.paho.org/sites/default/files/primary-care-illustration.jpg',
          },
          {
            src: 'https://www.consumoteca.com/wp-content/uploads/Urgencias-Emergencias-sanitarias-hospitales.jpg',
          },
          {
            src: 'https://www.anahuac.mx/mexico/EscuelasyFacultades/bioetica/sites/default/files/noticias/2020_05_15_cruzroja.jpg',
          },
        ],
  })  
}
</script>