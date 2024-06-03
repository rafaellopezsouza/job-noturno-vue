<template>
    <div>
        <div class="filter-options">
            <Dropdown class="dropdown-select-date" id="select-year" v-model="selectedYear" :options="selectYear" optionLabel="year" placeholder="Selecione o ano" />
            <Dropdown class="dropdown-select-options" id="select-Feature" v-model="selectedFeature" :options="selectFeature" optionLabel="name" placeholder="Selecione uma Funcionalidade" />
        </div>
        <hr>
        <div class="chart-line" v-if="scenariosTotal > 0">
            <ChartLine :labels="dataLabels" :totalScenarios="scenariosTotal" :totalPassed="passedTotal"
                :totalFailed="failedTotal" :totalSkipped="skippedTotal" :totalPending="pendingTotal"
                :totalUndefined="undefinedTotal" :totalAmbiguous="ambiguousTotal" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import Dropdown from 'primevue/dropdown';
import ChartLine from "../ChartLine.vue";
import { months, years } from "../../assets/data";
import { getFeatures, getByFeatureAndDate } from '../../services/api';
import { dashboardName } from '../../assets/data';


interface YearProps {
    year: string;
}

interface FeatureProps {
    name: string;
}

interface DataTableItem {
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
    name: 'Annual',
    components: {
        Dropdown,
        ChartLine
    },
    props: {
        path: String,
    },
    setup(props) {
        const getCurrentYear = (): YearProps => {
            const currentDate = new Date();
            const currentYearCode = currentDate.getFullYear().toString();
            return years.find(year => year.year === currentYearCode) as YearProps;
        }

        const selectedYear = ref<YearProps>(getCurrentYear());
        const selectedFeature = ref<FeatureProps>({name: "Todos"});
        const selectYear = ref<YearProps[]>([]);
        const selectFeature = ref<FeatureProps[]>([]);

        const passedTotal = ref<number>(0);
        const failedTotal = ref<number>(0);
        const skippedTotal = ref<number>(0);
        const pendingTotal = ref<number>(0);
        const undefinedTotal = ref<number>(0);
        const ambiguousTotal = ref<number>(0);
        const scenariosTotal = ref<number>(0);
        let dataResult: DataTableItem[] = [];


        const fetchYears = () => {
            selectYear.value = years.map(year => ({ year: year.year }));
        };

        const fetchFeatureNames = async (year: string) => {
            try {
                const startDate = `${year}-01-01`;
                const endDate = `${year}-12-31`;

                const dataResult = await getByFeatureAndDate({
                    project: props.path,
                    dashboardName: dashboardName[0],
                    startDate,
                    endDate
                });

                const execID = dataResult[0]?.execID;

                if (execID) {
                    const featuresResult = await getFeatures({
                        project: props.path,
                        execID
                    });

                    const dataFromAPI = featuresResult.map((item: any) => ({ name: item.name }));
                    selectFeature.value = [{ name: "Todos" }, ...dataFromAPI];
                }
            } catch (error) {
                console.error("Erro ao buscar nomes de funcionalidades:", error);
                selectFeature.value = [{ name: "Nenhum valor encontrado" }];
            }
        };

        const fetchData = async (year: string, feature: FeatureProps) => {
            try {
                const startDate = `${year}-01-01`;
                const endDate = `${year}-12-31`;
                let featureData;

                if (feature.name === "Todos") {
                    featureData = await getByFeatureAndDate({
                        project: props.path,
                        dashboardName: dashboardName[0],
                        startDate,
                        endDate
                    });
                } else {
                    featureData = dataResult.filter(item => item.date.startsWith(`${year}`));
                }

                calculateTotals(featureData);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        const calculateTotals = (featureData: DataTableItem[]) => {
            passedTotal.value = featureData.reduce((total, item) => total + (item.result.scenariosPassed || 0), 0);
            failedTotal.value = featureData.reduce((total, item) => total + (item.result.scenariosFailed || 0), 0);
            skippedTotal.value = featureData.reduce((total, item) => total + (item.result.scenariosSkipped || 0), 0);
            pendingTotal.value = featureData.reduce((total, item) => total + (item.result.scenariosPending || 0), 0);
            undefinedTotal.value = featureData.reduce((total, item) => total + (item.result.scenariosUndefined || 0), 0);
            ambiguousTotal.value = featureData.reduce((total, item) => total + (item.result.scenariosAmbiguous || 0), 0);
            scenariosTotal.value = featureData.reduce((total, item) => total + (item.result.scenariosTotal || 0), 0);
        };

        const dataLabels = computed(() => {
            return months.map(item => item.month)
        });

        onMounted(() => {
            fetchYears();
            fetchFeatureNames(selectedYear.value.year);
        });

        watch([selectedYear, selectedFeature], async ([year, feature]) => {
            if (year && feature) {
                fetchData(year.year, feature);
            }
        });

        return {
            selectedYear,
            selectYear,
            selectedFeature,
            selectFeature,
            passedTotal,
            failedTotal,
            skippedTotal,
            pendingTotal,
            undefinedTotal,
            ambiguousTotal,
            scenariosTotal,
            dataLabels
        };
    },
});
</script>

<style scoped>
</style>
