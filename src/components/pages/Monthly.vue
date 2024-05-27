<template>
    <div class="monthly">
        <div class="filter-options">
            <Dropdown id="select-month" class="dropdown-month" v-model="selectedMonth" :options="selectMonth"
                optionLabel="month" placeholder="Selecione o mês" />
            <Dropdown id="select-dashboard" v-model="selectedFeature" :options="selectFeature" optionLabel="name"
                placeholder="Selecione uma Funcionalidade" />
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
import { months } from "../../assets/data";
import { getFeatures, getByFeatureAndDate } from "../../services/api";

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
        dataTable: {
            type: Array as () => DataTableItem[],
            required: true
        },
    },
    setup(props) {
        const getCurrentMonth = (): Month => {
            const currentDate = new Date();
            const currentMonthCode = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            return months.find(month => month.code === currentMonthCode) as Month;
        }

        const selectedMonth = ref<Month>(getCurrentMonth());
        const selectedFeature = ref<FeatureProps | null>(null);

        const selectMonth = ref<Month[]>(months);
        const selectFeature = ref<FeatureProps[]>([{ name: "jobNoturno" }]);

        const passedTotal = ref<number>(0);
        const failedTotal = ref<number>(0);
        const skippedTotal = ref<number>(0);
        const pendingTotal = ref<number>(0);
        const undefinedTotal = ref<number>(0);
        const ambiguousTotal = ref<number>(0);
        const scenariosTotal = ref<number>(0);

        const fetchFeatureNames = async () => {
            if (props.path !== undefined) {
                const FeatureData = await getFeatures({ project: props.path, execID: "" });
                const dataFromAPI = FeatureData.map((name: string) => ({ name }));
                selectFeature.value = [{ name: "Todos" }, ...dataFromAPI];
            }
        };

        watch([selectedMonth, selectedFeature], async ([month, feature]) => {
            if (month && feature) {
                fetchData(month.code, feature);
            }
        });

        onMounted(() => {
            fetchFeatureNames();
        });

        const fetchData = async (month: string, feature: FeatureProps) => {
            try {
                const startDate = `${new Date().getFullYear()}-${month}-01`;
                const endDate = `${new Date().getFullYear()}-${month}-31`;
                let featureData;
                if (props.path) {
                    if (feature.name === "Todos") {
                        featureData = await getFeatures({
                            project: props.path,
                            execID: ""
                        });
                    } else {
                        featureData = await getByFeatureAndDate({
                            project: props.path,
                            dashboardName: feature.name,
                            startDate,
                            endDate
                        });
                    }
                }
                calculateTotals(featureData);
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
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
            return props.dataTable.map(data => new Date(data.date).getDate().toString().padStart(2, '0'));
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

<style scoped></style>
