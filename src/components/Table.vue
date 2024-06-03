<template>
    <Accordion>
        <AccordionTab :header="totalResults">
            <DataTable class="table" :value="tableWithTotal" showGridlines>
                <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"></Column>
            </DataTable>
        </AccordionTab>
    </Accordion>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { labelsGraphs } from "../assets/data";

export default defineComponent({
    name: 'Table',
    props: {
        dataTable: {
            type: Array,
            required: true
        },
        totals: {
            type: Array,
            required: true
        }
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

        const totalResults =computed(()=>{
            return props.totals.map(item => `Total Cenários: ${item.result.scenariosTotal} - Duração: ${item.result.duration}`).join(', ');
        })

        const results = computed(() => {
            return props.totals.map(item => ({
                name: 'Total',
                result: {
                    scenariosTotal: item.result.scenariosTotal,
                    scenariosPassed: item.result.scenariosPassed,
                    scenariosFailed: item.result.scenariosFailed,
                    scenariosSkipped: item.result.scenariosSkipped,
                    scenariosPending: item.result.scenariosPending,
                    scenariosUndefined: item.result.scenariosUndefined,
                    scenariosAmbiguous: item.result.scenariosAmbiguous,
                    duration: item.result.duration,
                }
            }));
        });

        const tableWithTotal = computed(() => {
            return [...props.dataTable, ...results.value];
        });

        return { columns, tableWithTotal, totalResults };
    }
});
</script>

<style scoped>
.table {
    width: 100%;
    margin-top: 20px;
}
</style>
