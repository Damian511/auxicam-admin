<template>
    <div>
        <v-card>
            <v-card-title>Generación de Reportes</v-card-title>
            <v-card-title>
                <v-select label="Seleccionar tipo de reporte" :items="reportes">
                </v-select>
            </v-card-title>
            <v-card-actions>
                <v-btn block color="primary">Generar</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            reportes:['Usuarios Activos','Simcards Activos']
        }
    }
}
</script>