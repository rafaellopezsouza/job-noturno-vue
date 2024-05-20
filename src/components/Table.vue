<template>
    <div class="card">
        <DataTable :value="tableWithTotal" showGridlines>
            <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"></Column>
        </DataTable>
    </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default defineComponent({
    name: 'Daily',
    props: {
        dataTable: Array,
    },
    components: {
        DataTable,
        Column,
    },
    setup(props) {
        const columns = [
            { field: 'dashboardName', header: 'Dashboard' },
            { field: 'result.scenariosTotal', header: 'Total' },
            { field: 'result.scenariosPassed', header: 'Passou' },
            { field: 'result.scenariosFailed', header: 'Falhou' },
            { field: 'result.scenariosSkipped', header: 'Pulou' },
            { field: 'result.scenariosPending', header: 'Pendente' },
            { field: 'result.scenariosUndefined', header: 'Indefinido' },
            { field: 'result.scenariosAmbiguous', header: 'Ambíguo' },
            { field: 'result.duration', header: 'Tempo' },
        ];

        const totalScenarios = computed(() => {
            return props.dataTable.reduce((total, item) => total + item.result.scenariosTotal, 0);
        });

        const totalPassed = computed(() => {
            return props.dataTable.reduce((total, item) => total + item.result.scenariosPassed, 0);
        });

        const totalFailed = computed(() => {
            return props.dataTable.reduce((total, item) => total + item.result.scenariosFailed, 0);
        });

        const totalSkipped = computed(() => {
            return props.dataTable.reduce((total, item) => total + item.result.scenariosSkipped, 0);
        });
        const totalPending = computed(() => {
            return props.dataTable.reduce((total, item) => total + item.result.scenariosPending, 0);
        });
        const totalUndefined = computed(() => {
            return props.dataTable.reduce((total, item) => total + item.result.scenariosUndefined, 0);
        });
        const totalAmbiguous = computed(() => {
            return props.dataTable.reduce((total, item) => total + item.result.scenariosAmbiguous, 0);
        });

        const totalTime = computed(() => {
            const totalMilliseconds = props.dataTable.reduce((total, item) => total + item.result.duration, 0);
            return totalMilliseconds;
        });

        const tableWithTotal = computed(() => {
            return [
                ...props.dataTable,
                {
                    dashboardName: 'Total',
                    result: {
                        scenariosTotal: totalScenarios.value,
                        scenariosPassed: totalPassed.value,
                        scenariosFailed: totalFailed.value,
                        scenariosSkipped: totalSkipped.value,
                        scenariosPending: totalPending.value,
                        scenariosUndefined: totalUndefined.value,
                        scenariosAmbiguous: totalAmbiguous.value,
                        duration: totalTime.value,
                    },
                },
            ];
        });

        return { columns, tableWithTotal };
    },
    methods: {
        convertToMinutes(milliseconds) {
            return milliseconds;
        },
    },
});
</script>

<style scoped></style>
