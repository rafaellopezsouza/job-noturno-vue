<template>
    <div class="input-calendar">
        <label for="calendar">Selecione uma data:</label>
        <Calendar v-model="date" dateFormat="dd/mm/yy" />
    </div>
    <h4 class="title-graph">Titulo do Gráfico: {{ datasetLabel }}</h4>
    <div class="grid-daily">
        <Table :dataTable="dataTable" />
        <PieChart :totalScenarios="totalScenarios" :totalFailed="totalFailed" :totalPassed="totalPassed"
            :totalSkipped="totalSkipped" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import PieChart from "../components/PieChart.vue"
import Table from "../components/Table.vue"
import Calendar from 'primevue/calendar';


import { ref } from "vue";

export default defineComponent({
    name: 'Daily',
    components: {
        PieChart,
        Table,
        Calendar,
    },
    props: {
        datasetLabel: String,
        dataTable: Array,
    },
    setup() {
        const date = ref(null);
        return { date };
    },
    computed: {
        totalScenarios() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosTotal, 0);
        },
        totalPassed() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosPassed, 0);
        },
        totalFailed() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosFailed, 0);
        },
        totalSkipped() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosSkipped, 0);
        },
    },
});
</script>

<style scoped>
.input-calendar {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--primary-color);
}

.input-calendar label {
    margin-right: 20px;
}

.grid-daily {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 20px;
}
</style>
