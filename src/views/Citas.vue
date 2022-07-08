<template>
  <div>
    <v-toolbar-title>Citas</v-toolbar-title>
    <v-divider class="mx-4" inset vertical></v-divider>
    <v-spacer></v-spacer>
    <Calendario />
  </div>
</template>
<script>
import Calendario from "../components/Calendario";

export default {
  components: {
    Calendario,
  },
  data: () => ({}),
};
</script>