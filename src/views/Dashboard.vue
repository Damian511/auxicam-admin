<template>
  <v-container>
    <h1 class=" block">Bienvenidos al Sistema de Gestión del aplicativo <span class="font-weight-black">AUXICAM</span></h1>
    <v-divider></v-divider>
    <br>
    <span class="block title">Esta página esta diseñada para la administración de la APP AUXICAM para posicionamiento de mascotas</span>
    <br>
    <p>Mediante esta página se podra dar de alta a los usuarios de la aplicación, dar de alta las simcards así como la generación de reportes</p>
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