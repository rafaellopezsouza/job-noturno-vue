<template>
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


export default defineComponent({
    name: 'Daily',
    components: {
        PieChart,
        Table,
    },
    props: {
        datasetLabel: String,
        dataTable: Array,
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

<style scoped></style>
