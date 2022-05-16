<template>
    <v-data-table :headers="headers" :items="usuarios" sort-by="calories" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Usuarios</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                            Nuevo Usuario
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.Nombre" label="Nombres"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.Apellido" label="Apellido"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.NombreUsuario" label="User"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.Correo" label="Correo"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.Telefono" label="Telefono"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.Direccion" label="Direccion"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.FechaNacimiento" label="Fecha de Nacimiento"></v-text-field>
                                    </v-col>
                                    
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">
                                Cancelar
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="save">
                                Guardar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
                mdi-delete
            </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
                Reset
            </v-btn>
        </template>
    </v-data-table>
</template>

<script>
export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: 'Nombres', value: 'Nombre' },
            { text: 'Apellidos', value: 'Apellido' },
            { text: 'User', value: 'NombreUsuario' },
            { text: 'Correo', value: 'Correo' },
            { text: 'Telefono', value: 'Telefono' },
            { text: 'Direccion', value: 'Direccion' },
            { text: 'Fecha de Nacimiento', value: 'FechaNacimiento' },
            { text: 'Estado', value: 'EstadoID' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        usuarios: [],
        editedIndex: -1,
        editedItem: {
            UsuarioID: '',
            RolID: '',
            Nombre: '',
            Apellido: '',
            NombreUsuario: '',
            Correo: '',
            Telefono: '',
            Direccion: '',
            FechaNacimiento: '',
            EstadoID: '',
        },
        defaultItem: {
            UsuarioID: '',
            RolID: '',
            Nombre: '',
            Apellido: '',
            NombreUsuario: '',
            Correo: '',
            Telefono: '',
            Direccion: '',
            FechaNacimiento: '',
            EstadoID: '',
        },
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
        },
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },
    created() {
        this.initialize()
    },
    methods: {
        initialize() {
            this.usuarios = [
                {
                    UsuarioID: '',
                    RolID: '',
                    Nombre: 'ANGELO DAMIAN',
                    Apellido: 'GONZALEZ',
                    NombreUsuario: 'agonzalez',
                    Correo: 'angelo@miler.com',
                    Telefono: '0000000000000',
                    Direccion: 'San Francisco',
                    FechaNacimiento: '06/01/1996',
                    EstadoID: '1',
                },
            ]
        },
        editItem(item) {
            this.editedIndex = this.usuarios.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem(item) {
            this.editedIndex = this.usuarios.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm() {
            this.usuarios.splice(this.editedIndex, 1)
            this.closeDelete()
        },
        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.usuarios[this.editedIndex], this.editedItem)
            } else {
                this.usuarios.push(this.editedItem)
            }
            this.close()
        },
    },
}
</script>