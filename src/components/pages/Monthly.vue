<template>
    <div>
        <div class="filter-options">
            <Dropdown class="dropdown-select-date" id="select-month" v-model="selectedMonth" :options="selectMonth"
                optionLabel="month" placeholder="Selecione o mês" />
            <Dropdown class="dropdown-select-options" id="select-dashboard" v-model="selectedFeature" :options="selectFeature" optionLabel="name"
                placeholder="Selecione uma Funcionalidade" />
        </div>
        <hr>
        <div class="chart-line">
            <ChartLine :labels="dataLabels" :totalScenarios="scenariosTotal" :totalPassed="passedTotal"
                :totalFailed="failedTotal" :totalSkipped="skippedTotal" :totalPending="pendingTotal"
                :totalUndefined="undefinedTotal" :totalAmbiguous="ambiguousTotal" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import ChartLine from "../ChartLine.vue";
import { months } from "../../assets/data";
import { getFeatures, getByFeatureAndDate, getFeaturesByMonth } from "../../services/api";
import { dashboardName } from '../../assets/data';

interface Month {
    month: string;
    code: string;
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
    name: 'Monthly',
    components: {
        Dropdown,
        ChartLine
    },
    props: {
        path: String,
    },
    setup(props) {
        const getCurrentMonth = (): Month => {
            const currentDate = new Date();
            const currentMonthCode = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            return months.find(month => month.code === currentMonthCode) as Month;
        }

        const selectedMonth = ref<Month>(getCurrentMonth());
        const selectedFeature = ref<FeatureProps>({ name: "Todos" });
        const selectMonth = ref<Month[]>(months);
        const selectFeature = ref<FeatureProps[]>([]);
        const passedTotal = ref<number[]>([]);
        const failedTotal = ref<number[]>([]);
        const skippedTotal = ref<number[]>([]);
        const pendingTotal = ref<number[]>([]);
        const undefinedTotal = ref<number[]>([]);
        const ambiguousTotal = ref<number[]>([]);
        const scenariosTotal = ref<number[]>([]);
        const dataLabels = ref<string[]>([]);
        let dataResult: DataTableItem[] = [];

        const fetchFeatureNames = async (month: string) => {
            try {
                const startDate = `${new Date().getFullYear()}-${month}-01`;
                const endDate = `${new Date().getFullYear()}-${month}-31`;
                dataResult = await getByFeatureAndDate({
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

        const fetchData = async (feature: FeatureProps) => {
            try {
                const startDate = `${new Date().getFullYear()}-${selectedMonth.value.code}-01`;
                const endDate = `${new Date().getFullYear()}-${selectedMonth.value.code}-31`;
                let featureData;
                if (feature.name === "Todos") {
                    featureData = await getByFeatureAndDate({
                        project: props.path,
                        dashboardName: dashboardName[0],
                        startDate,
                        endDate
                    });
                    calculateTotals(featureData);
                } else {
                    featureData = await getFeaturesByMonth({
                        project: props.path, 
                        data: dataResult,
                        featureName: feature.name
                    });
                    calculateTotalsFromFeatureData(featureData);
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                selectFeature.value = [{ name: "Nenhum valor encontrado" }];
            }
        };

        const calculateTotalsFromFeatureData = (featureData: any[]) => {
    featureData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Limpe os arrays reativos antes de preenchê-los novamente
    passedTotal.value = [];
    failedTotal.value = [];
    skippedTotal.value = [];
    pendingTotal.value = [];
    undefinedTotal.value = [];
    ambiguousTotal.value = [];
    scenariosTotal.value = [];
    dataLabels.value = [];

    featureData.forEach((dayData: any) => {
        const dayTotal = {
            passed: 0,
            failed: 0,
            skipped: 0,
            pending: 0,
            undefined: 0,
            ambiguous: 0,
            total: 0
        };

        dayData.data[0].forEach((feature: any) => {
            const result = feature.result;

            dayTotal.passed += result.scenariosPassed || 0;
            dayTotal.failed += result.scenariosFailed || 0;
            dayTotal.skipped += result.scenariosSkipped || 0;
            dayTotal.pending += result.scenariosPending || 0;
            dayTotal.undefined += result.scenariosUndefined || 0;
            dayTotal.ambiguous += result.scenariosAmbiguous || 0;
            dayTotal.total += result.scenariosTotal || 0;
        });

        passedTotal.value.push(dayTotal.passed);
        failedTotal.value.push(dayTotal.failed);
        skippedTotal.value.push(dayTotal.skipped);
        pendingTotal.value.push(dayTotal.pending);
        undefinedTotal.value.push(dayTotal.undefined);
        ambiguousTotal.value.push(dayTotal.ambiguous);
        scenariosTotal.value.push(dayTotal.total);
        dataLabels.value.push(new Date(dayData.date).getDate());
    });
};

       
        const calculateTotals = (featureData: DataTableItem[]) => {
            featureData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            passedTotal.value = featureData.map(item => item.result.scenariosPassed || 0);
            failedTotal.value = featureData.map(item => item.result.scenariosFailed || 0);
            skippedTotal.value = featureData.map(item => item.result.scenariosSkipped || 0);
            pendingTotal.value = featureData.map(item => item.result.scenariosPending || 0);
            undefinedTotal.value = featureData.map(item => item.result.scenariosUndefined || 0);
            ambiguousTotal.value = featureData.map(item => item.result.scenariosAmbiguous || 0);
            scenariosTotal.value = featureData.map(item => item.result.scenariosTotal || 0);
            dataLabels.value = featureData.map(item => new Date(item.date).getDate());
        };

        watch([selectedMonth, selectedFeature], async ([month, feature]) => {
            if (month && feature) {
                await fetchFeatureNames(month.code);
                await fetchData(feature);
            }
        });
        watch(selectedFeature, async (newFeature) => {
            if (selectedMonth.value && newFeature) {
                await fetchData(newFeature);
            }
        });

        onMounted(() => {
            fetchData(selectedFeature);
        });

        return {
            selectedMonth,
            selectMonth,
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
    }
});
</script>

<style scoped>
</style>
