
<template>
  <v-card elevation="5" class="ml-1 mr-1 mt-1">
    <h1 style="text-align: center;">Ubicación del hospital básico del Oro</h1>
    <gmap-map
    :center="center"
    :zoom="16"
    style="width: 100%; height: 500px"
  >
    <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :title="m.title"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
    ></gmap-marker>
  </gmap-map>
  </v-card>
</template>
<script>
  export default {
    data () {
      return {
        
        center: {lat: this.latitude, lng: this.longitude},
        markers: [{
          position: {lat: this.latitude, lng: this.longitude},
          title: this.title
        }]
      }
    },

    props: {
        latitude: Number,
        longitude: Number,
        title: String
    }
  }
</script>
