<template>
  <v-app id="inspire">
    <v-app-bar app color="primary">
      <router-link class="text-decoration-none" to="/">
        <v-toolbar-title class="white--text"> AUXICAM - APP </v-toolbar-title>
      </router-link>

      <router-link
        class="text-decoration-none m-2"
        to="/usuario"
        v-if="isLoggedIn"
      >
        <v-btn text class="white--text"> Usuarios </v-btn>
      </router-link>

      <router-link
        class="text-decoration-none"
        to="/simcard"
        v-if="isLoggedIn"
      >
        <v-btn text class="white--text"> SimCards </v-btn>
      </router-link>

      <v-spacer></v-spacer>
      <router-link class="text-decoration-none" to="/login" v-if="!isLoggedIn">
        <v-btn text class="white--text"> Login </v-btn>
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