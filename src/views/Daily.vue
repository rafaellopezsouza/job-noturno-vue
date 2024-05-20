<template>
    <div class="input-calendar">
        <label for="calendar">Selecione uma data:</label>
        <Calendar v-model="date" dateFormat="dd/mm/yy" />
    </div>
    <h4 class="title-graph">Titulo do Gráfico: {{ path }}</h4>
    <div class="grid-daily">
        <Table :dataTable="dataTable" />
        <ChartPie :totalScenarios="totalScenarios" :totalFailed="totalFailed" :totalPassed="totalPassed"
            :totalSkipped="totalSkipped" :totalPending="totalPending" :totalUndefined="totalUndefined"
            :totaAmbiguous="totaAmbiguous" />
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import ChartPie from "../components/ChartPie.vue"
import Table from "../components/Table.vue"
import Calendar from 'primevue/calendar';

export default defineComponent({
    name: 'Daily',
    components: {
        ChartPie,
        Table,
        Calendar,
    },
    props: {
        path: String,
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
        totalPending() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosPending, 0);
        },
        totalUndefined() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosUndefined, 0);
        },
        totaAmbiguous() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosAmbiguous, 0);
        },
    },
});
</script>

<style scoped>
.select-data {
    display: flex;
}

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
