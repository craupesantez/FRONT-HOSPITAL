<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{ token }}
  </div>
</template>

<script>
import { mapState} from 'vuex'
import axios from "axios";
export default {
  computed: {
     ...mapState(['token'])
  },
  methods: {
    async datosProtegidos(){
      try {
        const rest = await fetch('http://localhost:3000/api/v1/especialidades',{
          headers: {
            'Content-Type': 'application/json',
            // 'token': this.token
            'Authorization': 'Bearer '+this.token
          }
        });
        const dataDB = await rest.json(); 
        console.log(dataDB);
      } catch (error) {
        console.log(error);
      }
    }
  },
  created(){
    this.datosProtegidos();
  }
}
</script>
