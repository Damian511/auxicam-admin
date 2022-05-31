<template>
  <v-data-table
    :headers="headers"
    :items="usuarios"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Usuarios</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="850px" persistent>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Nuevo Usuario
            </v-btn>
          </template>
          <v-card>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-card-title
                class="
                  text-h6
                  font-weight-regular
                  justify-space-between
                  blue-grey
                "
              >
                <span class="white--text">{{ formTitle }}</span>
                <v-btn icon @click="close">
                  <v-icon color="white"> close </v-icon>
                </v-btn>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.Nombre"
                        prepend-icon="person"
                        label="Nombres"
                        :rules="defaultRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.Apellido"
                        prepend-icon="person"
                        label="Apellido"
                        :rules="defaultRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.Correo"
                        prepend-icon="mail"
                        label="Correo"
                        :rules="emailRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.Telefono"
                        prepend-icon="phone"
                        label="N° Celular"
                        v-maska="'(####) ### - ###'"
                        :rules="defaultRules"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.Direccion"
                        prepend-icon="home"
                        label="Direccion"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-menu
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.FechaNacimiento"
                            label="Fecha Ingreso"
                            prepend-icon="event"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            :rules="defaultRules"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          locale="Es"
                          v-model="editedItem.FechaNacimiento"
                          @input="menu = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click.prevent="validate">
                  Guardar
                </v-btn>
                <v-btn color="red darken-1" text @click="close">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="650px" persistent>
          <v-card>
            <v-card-title class="text-h5 d-flex justify-center"
              >Estas seguro que deseas eliminar este registro?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="deleteItemConfirm"
                >ACEPTAR</v-btn
              >
              <v-btn color="red darken-1" text @click="closeDelete"
                >CANCELAR</v-btn
              >
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
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data: () => ({
    defaultRules:[
      (v) => !!v || "El campo es obligatorio",
    ],
    emailRules: [
      (v) => !!v || "El campo es obligatorio",
      (v) => /.+@.+/.test(v) || "El correo no es válido",
    ],
    menu: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ID", value: "UsuarioID" },
      { text: "Nombres", value: "Nombre" },
      { text: "Apellidos", value: "Apellido" },
      { text: "Correo", value: "Correo" },
      { text: "Telefono", value: "Telefono" },
      { text: "Direccion", value: "Direccion" },
      { text: "Fecha de Nacimiento", value: "FechaNacimiento" },
      { text: "Estado", value: "EstadoID" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    usuarios: [],
    editedIndex: -1,
    editedItem: {
      UsuarioID: "",
      RolID: "",
      Nombre: "",
      Apellido: "",
      NombreUsuario: "",
      Correo: "",
      Telefono: "",
      Direccion: "",
      FechaNacimiento: "",
      EstadoID: "",
    },
    defaultItem: {
      UsuarioID: "",
      RolID: "",
      Nombre: "",
      Apellido: "",
      NombreUsuario: "",
      Correo: "",
      Telefono: "",
      Direccion: "",
      FechaNacimiento: "",
      EstadoID: "",
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
  },
  created() {
    this.initialize();
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    initialize() {
      this.usuarios = [
        {
          UsuarioID: 1,
          RolID: "",
          Nombre: "ANGELO DAMIAN",
          Apellido: "GONZALEZ",
          NombreUsuario: "agonzalez",
          Correo: "angelo@miler.com",
          Telefono: "0000000000000",
          Direccion: "San Francisco",
          FechaNacimiento: "1996-01-06",
          EstadoID: "1",
        },
      ];
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
    deleteItemConfirm() {
      this.usuarios.splice(this.editedIndex, 1);
      this.closeDelete();
    },
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
      this.$refs.form.reset()
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.usuarios[this.editedIndex], this.editedItem);
      } else {
        this.usuarios.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>