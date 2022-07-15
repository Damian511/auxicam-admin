<template>
    <div>
        <v-card>
            <v-card-title>Generación de Reportes</v-card-title>
            <v-card-title>
                <v-select label="Seleccionar tipo de reporte" :items="reportes" item-text="text" item-value="value"
                    v-model="select">
                </v-select>
            </v-card-title>
            <v-card-actions>
                <v-btn block color="primary" @click="getReportes">Generar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
//import axios from 'axios'
import User from '@/apis/User'
export default {
    data() {
        return {
            reportes: [{ 'text': 'Usuarios Activos', 'value': 'user' }, { 'text': 'Simcards Activos', 'value': 'sim' }],
            select: ''
        }
    },
    methods: {
        getReportes() {
            switch (this.select) {
                case 'user':
                    User.reporteUsuario()
                        .then((response) => {
                            window.open(URL.createObjectURL(response.data));
                        }).catch(() => { })
                    break;
                case 'sim':
                    User.reporteSIM()
                        .then((response) => {
                            window.open(URL.createObjectURL(response.data));
                        }).catch(() => { })
                    break;
            }
        }
    }
}
</script>