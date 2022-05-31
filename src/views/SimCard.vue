<template>
  <v-data-table
    :headers="headers"
    :items="simcards"
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
              Nueva SimCard
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
                        v-model="editedItem.Numero"
                        prepend-icon="pin"
                        label="Numero de la SimCard"
                        v-maska="'(####) ### - ###'"
                        :rules="defaultRules"
                      ></v-text-field>
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
    defaultRules: [(v) => !!v || "El campo es obligatorio"],
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: "ID", value: "SimCardID" },
      { text: "Numero", value: "Numero" },
      { text: "Estado", value: "EstadoID" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    simcards: [],
    editedIndex: -1,
    editedItem: {
      SimCardID: "",
      Numero: "",
      EstadoID: "",
    },
    defaultItem: {
      SimCardID: "",
      Numero: "",
      EstadoID: "",
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
    this.initialize();
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    initialize() {
      this.simcards = [
        {
          SimCardID: "1",
          Numero: "0001111223233",
          EstadoID: "1",
        },
      ];
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
    deleteItemConfirm() {
      this.simcards.splice(this.editedIndex, 1);
      this.closeDelete();
    },
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
        Object.assign(this.simcards[this.editedIndex], this.editedItem);
      } else {
        this.simcards.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>