<template>

</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapState(['token', /*'visibleNavBar'*/]),
    // isAuthenticated() {
    //   return this.visibleNavBar;
    // },
  },
  created: function () {
    // this.leerToken();
    // if (this.token !== null) {
    //   this.VisibleNavbar = true;
    // }
  },
};
</script>
