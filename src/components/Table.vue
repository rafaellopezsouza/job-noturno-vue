<template>
    <Accordion>
        <AccordionTab :header="totalResults">
            <DataTable class="table" :value="dataTable" showGridlines>
                <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"></Column>
            </DataTable>
        </AccordionTab>
    </Accordion>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

import { labelsGraphs } from "../assets/data"


export default defineComponent({
    name: 'Table',
    props: {
        dataTable: Array,
        totals: Array
    },
    components: {
        DataTable,
        Column,
        Accordion,
        AccordionTab,
    },
    setup(props) {
        const columns = [
            { field: 'name', header: 'Nome' },
            { field: 'result.scenariosTotal', header: labelsGraphs.total },
            { field: 'result.scenariosPassed', header: labelsGraphs.passed },
            { field: 'result.scenariosFailed', header: labelsGraphs.failed },
            { field: 'result.scenariosSkipped', header: labelsGraphs.skipped },
            { field: 'result.scenariosPending', header: labelsGraphs.pending },
            { field: 'result.scenariosUndefined', header: labelsGraphs.undefined },
            { field: 'result.scenariosAmbiguous', header: labelsGraphs.ambiguous },
            { field: 'result.duration', header: labelsGraphs.time },
        ];

        const totalScenarios = computed(() => {
            return props.dataTable.reduce((total, item) => total + item.result.scenariosTotal, 0);
        });

        const totalResults = computed(() => {
            console.log("AQUI2: " + JSON.stringify(props.totals))
            return `Total Cenários: ${"30"} - Duração: ${"2h 30m"}`
        })


        return { columns, totalResults };
    },
});
</script>

<style scoped></style>
