<template>
  <div>
    <v-data-table :headers="headers" :items="simcards" sort-by="calories" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>SimCards</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="850px" persistent>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nueva SimCard
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
                        <v-text-field v-model="editedItem.numero" prepend-icon="pin" label="Numero de la SimCard"
                          v-maska="'(####)###-###'" :rules="defaultRules"></v-text-field>
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
                <v-btn color="green darken-1" text @click="desactivarSim">ACEPTAR</v-btn>
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
    defaultRules: [(v) => !!v || "El campo es obligatorio"],
    dialog: false,
    dialogDelete: false,
    snackbar: false,
    textSnack: '',
    timeout:3000,
    headers: [
      { text: "ID", value: "simcardid" },
      { text: "Numero", value: "numero" },
      { text: "Estado", value: "estado.descripcion" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    simcards: [],
    editedIndex: -1,
    editedItem: {
      simcardid: "",
      numero: "",
      estadoid: "",
      estado: {
        estadoid: '',
        descripcion: '',
        activo: '',
      },
    },
    defaultItem: {
      simcardid: "",
      numero: "",
      estadoid: "",
      estado: {
        estadoid: '',
        descripcion: '',
        activo: '',
      },
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Sim" : "Editar Sim";
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
    this.getSim();
  },
  methods: {
    getSim() {
      User.listarSIM()
        .then(response => {
          this.simcards = response.data
        })
    },
    altaSim() {
      User.crearSIM(this.editedItem)
        .then((response) => {
          this.getSim()
          this.snackbar = true
          this.textSnack = 'Se realizo la operación'
        }).catch(error => {
          console.log(response)
          this.snackbar = true
          this.textSnack = 'No se pudo realizar la operación'
        })
    },
    editarSim() {
      User.editarSIM(this.editedItem, this.editedItem.simcardid)
        .then(() => {
          this.getSim()
          this.snackbar = true
          this.textSnack = 'Se realizo la operación'
        }).catch()
    },
    desactivarSim() {
       User.desactivarSIM(this.editedItem.simcardid)
        .then(() => {
          this.closeDelete()
          this.getSim()
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
      this.editedIndex = this.simcards.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      this.editedIndex = this.simcards.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    /*  deleteItemConfirm() {
       this.simcards.splice(this.editedIndex, 1);
       this.closeDelete();
     }, */
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.reset();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$refs.form.reset();
    },
    save() {
      if (this.editedIndex > -1) {
        this.editarSim(this.editedIndex)
      } else {
        this.altaSim()
      }
      this.close();
    },
  },

  /*  save() {
     if (this.editedIndex > -1) {
       Object.assign(this.simcards[this.editedIndex], this.editedItem);
     } else {
       this.simcards.push(this.editedItem);
     }
     this.close();
   }, */
};
</script>