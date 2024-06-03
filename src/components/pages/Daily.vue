<template>
    <div class="filter-options">
        <Calendar class="dropdown-select-date" v-model="selectedDate" showIcon dateFormat="dd/mm/yy"
            inputId="selectDate" placeholder="Selecione uma data" />
        <Dropdown class="dropdown-select-options" id="select-Feature" v-model="selectedFeature" :options="selectFeature"
            optionLabel="name" placeholder="Selecione uma Funcionalidade" />
    </div>
    <hr>
    <ChartPie class="graph" v-if="totalScenarios > 0" :totalScenarios="totalScenarios" :totalFailed="totalFailed"
        :totalPassed="totalPassed" :totalSkipped="totalSkipped" :totalPending="totalPending"
        :totalUndefined="totalUndefined" :totalAmbiguous="totalAmbiguous" @update-data="updateDataTable" />
    <Table class="table" v-if="selectedFeature.name === 'Todos'" :dataTable="dataTable" :totals="dataResult"/>
</template>

<script lang="ts">
import { defineComponent, ref, watch, Ref, onMounted } from 'vue';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import { getByFeatureAndDate, getFeatures } from "../../services/api";
import { dashboardName } from '../../assets/data';
import ChartPie from "../ChartPie.vue";
import Table from "../Table.vue";

interface FeatureProps {
    name: string;
    featureID: number;
}

interface DataTableItem {
    name: string;
    date: string;
    result: {
        scenariosTotal: number;
        scenariosFailed: number;
        scenariosPassed: number;
        scenariosSkipped: number;
        scenariosPending: number;
        scenariosUndefined: number;
        scenariosAmbiguous: number;
    };
}

export default defineComponent({
    name: 'Daily',
    components: {
        Calendar,
        Dropdown,
        ChartPie,
        Table,
    },
    props: {
        path: {
            type: String,
            required: true
        },
        dataTable: {
            type: Array as () => DataTableItem[],
            required: true
        }
    },
    setup(props) {
        const selectedDate = ref<Date>(new Date());
        const selectedFeature = ref<FeatureProps>({ name: "Todos" });
        const selectFeature = ref<FeatureProps[]>([]);
        const totalScenarios: Ref<number> = ref(0);
        const totalFailed: Ref<number> = ref(0);
        const totalPassed: Ref<number> = ref(0);
        const totalSkipped: Ref<number> = ref(0);
        const totalPending: Ref<number> = ref(0);
        const totalUndefined: Ref<number> = ref(0);
        const totalAmbiguous: Ref<number> = ref(0);
        const dataTable = ref<DataTableItem[]>([]);
        const dataResult = ref<DataTableItem[]>([]);
        var execID: string | null = null;

        const fetchFeaturesNames = async (date: Date) => {
            try{
                const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                const formattedDate = nextDay.toISOString().split('T')[0];
                const result = await getByFeatureAndDate({
                    project: props.path,
                    dashboardName: dashboardName[0],
                    startDate: formattedDate,
                    endDate: formattedDate
                });

                dataResult.value = result;
                execID = result[0].execID;
                const featuresResult = await getFeatures({
                    project: props.path,
                    execID
                });
                dataTable.value = featuresResult.map(item => ({ name: item.name, ...item }));
                const dataFromAPI = featuresResult.map((item: any) => ({ name: item.name }));
                selectFeature.value = [{ name: "Todos" }, ...dataFromAPI];
            }
            catch(error){
                selectFeature.value = [{ name: "Nenhum valor encontrado" }];
            }
        };

        const fetchData = async (date: Date, feature: FeatureProps) => {
            const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            const formattedDate = nextDay.toISOString().split('T')[0];
            let featureData;
            if (feature.name === "Todos") {
                featureData = await getByFeatureAndDate({
                    project: props.path,
                    dashboardName: dashboardName[0],
                    startDate: formattedDate,
                    endDate: formattedDate
                });
                dataResult.value = featureData;
            } else {
                const featuresResult = await getFeatures({
                    project: props.path,
                    execID
                });
                featureData = featuresResult.filter((f: any) => f.name === feature.name);
            }
            updateData(featureData);
        };

        const updateData = (featureData: DataTableItem[]) => {
            totalScenarios.value = featureData.reduce((total, item) => total + (item.result.scenariosTotal || 0), 0);
            totalFailed.value = featureData.reduce((total, item) => total + (item.result.scenariosFailed || 0), 0);
            totalPassed.value = featureData.reduce((total, item) => total + (item.result.scenariosPassed || 0), 0);
            totalSkipped.value = featureData.reduce((total, item) => total + (item.result.scenariosSkipped || 0), 0);
            totalPending.value = featureData.reduce((total, item) => total + (item.result.scenariosPending || 0), 0);
            totalUndefined.value = featureData.reduce((total, item) => total + (item.result.scenariosUndefined || 0), 0);
            totalAmbiguous.value = featureData.reduce((total, item) => total + (item.result.scenariosAmbiguous || 0), 0);
        };

        watch([selectedFeature, selectedDate], ([feature, date]) => {
            if (date && feature) {
                fetchData(date, feature);
                fetchFeaturesNames(date);
            }
        });

        onMounted(() => {
            fetchFeaturesNames(selectedDate.value);
        });

        return {
            selectedDate,
            selectedFeature,
            selectFeature,
            totalScenarios,
            totalFailed,
            totalPassed,
            totalSkipped,
            totalPending,
            totalUndefined,
            totalAmbiguous,
            dataTable,
            dataResult
        };
    },
});
</script>

<style scoped>
.graph {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
}

.table {
    width: 100%;
    margin-top: 300px; 
}
</style>
