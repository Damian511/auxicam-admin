<template>
  <div>
    <v-data-table :headers="headers" :items="usuarios" sort-by="calories" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Usuarios</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="50%" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo Usuario
              </v-btn>
            </template>
            <v-card>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-title class="
                  text-h6
                  font-weight-regular
                  justify-space-between
                  blue-grey
                ">
                  <span class="white--text">{{ formTitle }}</span>
                  <v-btn icon @click="close">
                    <v-icon color="white"> close </v-icon>
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col>
                        <v-text-field v-model="editedItem.name" prepend-icon="person" label="Nombres"
                          :rules="defaultRules"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field v-model="editedItem.email" prepend-icon="mail" label="Correo" :rules="emailRules">
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field v-model="editedItem.telefono" prepend-icon="phone" label="N° Celular"
                          v-maska="'(####)###-###'" :rules="defaultRules"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field v-model="editedItem.direccion" prepend-icon="home" label="Direccion"
                          :rules="defaultRules"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="editedItem.fechanacimiento" label="Fecha de Nacimiento"
                              prepend-icon="event" readonly v-bind="attrs" v-on="on" :rules="defaultRules">
                            </v-text-field>
                          </template>
                          <v-date-picker v-model="editedItem.fechanacimiento" @input="menu = false" locale="es"
                            min="1950-01-01" :active-picker.sync="activePicker"
                            :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)">
                          </v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="green darken-1" text @click.prevent="validate">
                    Guardar
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="650px" persistent>
            <v-card>
              <v-card-title class="text-h5 d-flex justify-center">Estas seguro que deseas eliminar este registro?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="desactivarUsuario">ACEPTAR</v-btn>
                <v-btn color="red darken-1" text @click="closeDelete">CANCELAR</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> edit </v-icon>
        <v-icon small @click="deleteItem(item)"> delete </v-icon>
      </template>
      <template v-slot:no-data>
        <span>No hay datos que mostrar</span>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ textSnack }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import User from "../apis/User";
export default {
  data: () => ({
    //validar formulario
    valid: false,
    snackbar: false,
    textSnack: '',
    timeout:3000,
    defaultRules: [
      (v) => !!v || "El campo es obligatorio",
    ],
    emailRules: [
      (v) => !!v || "El campo es obligatorio",
      (v) => /.+@.+/.test(v) || "El correo no es válido",
    ],
    menu: false,
    dialog: false,
    dialogDelete: false,
    activePicker: '',
    headers: [
      { text: "ID", value: "id" },
      { text: "Nombre", value: "name" },
      { text: "Correo", value: "email" },
      { text: "Telefono", value: "telefono" },
      { text: "Direccion", value: "direccion" },
      { text: "Fecha de Nacimiento", value: "fechanacimiento" },
      { text: "Rol", value: "rol.descripcion" },
      { text: "Estado", value: "estado.descripcion" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    usuarios: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      email: "",
      telefono: "",
      direccion: "",
      fechanacimiento: "",
      estadoid: "",
      estado: {
        estadoid: '',
        descripcion: '',
        activo: '',
      },
      rol: {
        rolid: '',
        descripcion: '',
        estadoid: ''
      }
    },
    defaultItem: {
      id: "",
      name: "",
      email: "",
      telefono: "",
      direccion: "",
      fechanacimiento: "",
      estadoid: "",
      estado: {
        estadoid: '',
        descripcion: '',
        activo: '',
      },
      rol: {
        rolid: '',
        descripcion: '',
        estadoid: ''
      }
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Usuario" : "Editar Usuario";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
  created() {
    //this.initialize();
    this.getUser();
  },
  methods: {

    getUser() {
      User.obtenerUsuarios()
        .then(response => {
          this.usuarios = response.data
        })
    },

    altaUsuario() {
      User.registrarUsuario(this.editedItem)
        .then(() => {
          this.getUser()
          this.snackbar = true
          this.textSnack = 'Se realizo la operación'
        }).catch(error => {
          this.snackbar = true
          this.textSnack = 'No se pudo realizar la operación'
        })
    },

    editarUsuario() {
      User.updateUsuario(this.editedItem, this.editedItem.id)
        .then(() => {
          this.getUser()
          this.snackbar = true
          this.textSnack = 'Se realizo la operación'
        }).catch()
    },
    
    desactivarUsuario() {
      User.desactivarUsuario(this.editedItem.id)
        .then(() => {
          this.closeDelete()
          this.getUser()
          this.snackbar = true
          this.textSnack = 'Se realizo la operación'
        }).catch()
    },

    validate() {
      var validacion = this.$refs.form.validate();
      if (validacion != false) {
        this.save()
      }
    },

    editItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

/*     deleteItemConfirm() {
      this.usuarios.splice(this.editedIndex, 1);
      this.closeDelete();
    }, */

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.reset()
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      //this.$refs.form.reset()
    },
    save() {
      if (this.editedIndex > -1) {
        this.editarUsuario(this.editedIndex)
      } else {
        this.altaUsuario()
      }
      this.close();
    },
  },
};
</script>