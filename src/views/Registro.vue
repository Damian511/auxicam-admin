<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs12 sm8 md4>
            <v-slide-y-transition>
              <v-card class="elevation-24" min-width="600">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>REGISTRAR USUARIO</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="register" v-model="valid" lazy-validation @submit.prevent="validar">

                    <v-text-field v-model="form.name" label="Nombre" prepend-icon="person" :rules="defaultRules">
                    </v-text-field>
                    <span class="text-danger" v-if="errors.name">
                      {{ errors.name[0] }}
                    </span>

                    <v-text-field v-model="form.email" prepend-icon="mail" name="login" label="Correo Electronico"
                      type="text" :rules="emailRules" required autocomplete="off"></v-text-field>
                    <span class="text-danger" v-if="errors.email">
                      {{ errors.email[0] }}
                    </span>

                    <v-text-field v-model="form.telefono" label="Telefono" prepend-icon="call" v-maska="'(####)###-###'"
                      :rules="defaultRules"></v-text-field>
                    <span class="text-danger" v-if="errors.telefono">
                      {{ errors.telefono[0] }}
                    </span>

                    <v-text-field v-model="form.direccion" label="Dirección" prepend-icon="home" :rules="defaultRules">
                    </v-text-field>
                    <span class="text-danger" v-if="errors.direccion">
                      {{ errors.direccion[0] }}
                    </span>

                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                      transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="form.fechanacimiento" label="Fecha de Nacimiento" prepend-icon="event"
                          readonly v-bind="attrs" v-on="on" :rules="defaultRules"></v-text-field>
                      </template>
                      <v-date-picker v-model="form.fechanacimiento" @input="menu = false" locale="es" min="1950-01-01"
                        :active-picker.sync="activePicker"
                        :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)">
                      </v-date-picker>
                    </v-menu>
                    <span class="text-danger" v-if="errors.fechanacimiento">
                      {{ errors.fechanacimiento[0] }}
                    </span>

                    <v-text-field v-model="form.password" id="password" prepend-icon="lock" name="password"
                      label="Contraseña" :rules="passwordRules" required autocomplete="off"
                      :type="show1 ? 'text' : 'password'" :append-icon="show1 ? 'visibility' : 'visibility_off'"
                      @click:append="show1 = !show1">
                    </v-text-field>
                    <span class="text-danger" v-if="errors.password">
                      {{ errors.password[0] }}
                    </span>

                    <v-text-field v-model="form.password_confirmation" id="password_confirmation" prepend-icon="lock"
                      name="confirm_password" label="Confirmar Contraseña"
                      :rules="defaultRules.concat(passwordConfirmationRule)" required autocomplete="off"
                      :type="show2 ? 'text' : 'password'" :append-icon="show2 ? 'visibility' : 'visibility_off'"
                      @click:append="show2 = !show2">
                    </v-text-field>
                    <span class="text-danger" v-if="errors.password_confirmation">
                      {{ errors.password_confirmation[0] }}
                    </span>

                    <v-spacer></v-spacer>
                    <v-btn block color="primary" type="submit" class="ma-2" justify-space-between>REGISTRAR</v-btn>
                    <v-btn block color="warning" class="ma-2" @click="resetear">LIMPIAR</v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-slide-y-transition>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import User from "../apis/User";

export default {
  data: () => ({
    activePicker: null,
    menu: false,
    show1: false,
    show2: false,
    //variables para guardar el formulario
    form: {
      name: '',
      email: '',
      telefono: '',
      direccion: '',
      fechanacimiento: '',
      password: '',
      password_confirmation: ''
    },
    errors: [],
    //reglas para el formulario
    defaultRules: [(v) => !!v || "El campo es requerido"],
    passwordRules: [
      (v) => !!v || 'El campo es requerido',
      (v) => (v && v.length >= 6) || '6 caracteres mínimos',
    ],
    emailRules: [
      v => !!v || 'El campo es requerido',
      v => /.+@.+\..+/.test(v) || 'Ingrese un correo válido',
    ],
    //variable para validar formulario
    valid: false,
  }),
  props: {
    source: String,
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
  computed: {
    passwordConfirmationRule() {
      return () => this.form.password === this.form.password_confirmation || "Password must match";
    }
  },
  methods: {
    validar() {
      var validacion = this.$refs.register.validate();
      if (validacion != false) {
        this.register();
      }
    },
    resetear() {
      this.$refs.register.reset();
      this.errors = [];
    },
    register() {
      User.register(this.form)
        .then(() => {
          this.$router.push({ name: "Login" });
        })
        .catch(error => {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors;
          }
        });
    }
  },
};
</script>
