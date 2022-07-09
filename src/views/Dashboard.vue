<template>
  <v-container>
    <span class="title block">Bienvenidos al Sistema de Gestión del aplicativo <span class="font-weight-black">AUXICAM</span></span>
  </v-container>
</template>

<script>
import User from "../apis/User";
export default {
  data() {
    return {
      user: null,
      date:null
    };
  },
  created() {
     User.auth().then(response => {
      this.user = response.data;
    }); 
  }
};
</script>