<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app color="blue-grey lighten-1" v-if="isLoggedIn" temporary>
      <v-container>
        <router-link class="text-decoration-none m-2" to="/usuario">
        <v-btn text class="white--text" block> Usuarios </v-btn>
      </router-link>

      <router-link class="text-decoration-none" to="/simcard">
        <v-btn text class="white--text" block> SimCards </v-btn>
      </router-link>

      <router-link class="text-decoration-none" to="/reportes">
        <v-btn text class="white--text" block> Reportes </v-btn>
      </router-link>
      </v-container>
    </v-navigation-drawer>

    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="white" v-if="isLoggedIn"></v-app-bar-nav-icon>
      <router-link class="text-decoration-none" to="/dashboard">
        <v-toolbar-title class="white--text"> AUXICAM - APP </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <router-link class="text-decoration-none" to="/login" v-if="!isLoggedIn">
        <v-btn text class="white--text"> Login </v-btn>
      </router-link>
      <router-link class="text-decoration-none" to="/register" v-if="!isLoggedIn">
        <v-btn text class="white--text"> Registrar </v-btn>
      </router-link>

      <v-btn v-if="isLoggedIn" text class="white--text" @click="logout">
        Salir
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<!-- <template>
  <v-app id="inspire">
    <v-app-bar app color="primary">
      <router-link class="text-decoration-none" to="/dashboard">
        <v-toolbar-title class="white--text"> AUXICAM - APP </v-toolbar-title>
      </router-link>

      <router-link class="text-decoration-none m-2" to="/usuario" v-if="isLoggedIn">
        <v-btn text class="white--text"> Usuarios </v-btn>
      </router-link>

      <router-link class="text-decoration-none" to="/simcard" v-if="isLoggedIn">
        <v-btn text class="white--text"> SimCards </v-btn>
      </router-link>

      <router-link class="text-decoration-none" to="/reportes" v-if="isLoggedIn">
        <v-btn text class="white--text"> Reportes </v-btn>
      </router-link>

      <v-spacer></v-spacer>
      <router-link class="text-decoration-none" to="/login" v-if="!isLoggedIn">
        <v-btn text class="white--text"> Login </v-btn>
      </router-link>
      <router-link class="text-decoration-none" to="/register" v-if="!isLoggedIn">
        <v-btn text class="white--text"> Registrar </v-btn>
      </router-link>

      <v-btn v-if="isLoggedIn" text class="white--text" @click="logout">
        Salir
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template> -->

<script>
import User from "./apis/User";
export default {
  data() {
    return {
      isLoggedIn: false,
      drawer: false,
    };
  },
  mounted() {
    this.$root.$on("login", () => {
      this.isLoggedIn = true;
    });
    this.isLoggedIn = !!localStorage.getItem("auth");
  },
  methods: {
    logout() {
      User.logout().then(() => {
        localStorage.removeItem("auth");
        this.isLoggedIn = false;
        this.$router.push({ name: "Login" });
      });
    },
  },
};
</script>