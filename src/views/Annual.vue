<template>
    <div class="filter-options">
        <Dropdown id="select-year" v-model="selectedYear" :options="selectYear" optionLabel="year"
            placeholder="Selecione o ano" />
        <Dropdown id="select-dashboard" v-model="selectedDashboard" :options="selectDashboard" optionLabel="name"
            placeholder="Selecione um Dashboard" />
    </div>
    <hr>
    <div class="chart-line">
        <ChartLine :labels="dataLabels" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
import ChartLine from "../components/ChartLine.vue";
import { dashboardName } from "../assets/dataMock";
import { years } from "../assets/data";

interface YearProps {
    year: string;
}

interface DashboardProps {
    name: string;
}

export default defineComponent({
    name: 'Annual',
    components: {
        Dropdown,
        ChartLine
    },
    props: {
        path: String,
        dataTable: {
            type: Array as () => Array<{ date: string, result: any }>,
            required: true
        }
    },
    setup(props) {
        const selectedYear = ref<YearProps | null>(null);
        const selectedDashboard = ref<DashboardProps | null>(null);

        const selectYear = ref<YearProps[]>([]);
        const selectDashboard = ref<DashboardProps[]>([]);

        const fetchYears = async () => {
            // Simulando a obtenção de dados da API
            setTimeout(() => {
                const dataFromAPI = years.map(year => ({ year }));
                selectYear.value = dataFromAPI;
            }, 1000);
        };

        const fetchDashboardNames = async () => {
            // Simulando a obtenção de dados da API
            setTimeout(() => {
                const dataFromAPI = dashboardName.map(name => ({ name }));
                selectDashboard.value = [{ name: "Todos" }, ...dataFromAPI];
            }, 1000);
        };

        const dataLabels = computed(() =>
            props.dataTable.map(data => new Date(data.date).getDate().toString().padStart(2, '0'))
        );

        onMounted(() => {
            fetchYears();
            fetchDashboardNames();
        });

        const totalScenarios = computed(() => {
            return props.dataTable?.reduce((total, item) => total + (item.result.scenariosTotal || 0), 0) || 0;
        });

        const totalPassed = computed(() => {
            return props.dataTable?.reduce((total, item) => total + (item.result.scenariosPassed || 0), 0) || 0;
        });

        const totalFailed = computed(() => {
            return props.dataTable?.reduce((total, item) => total + (item.result.scenariosFailed || 0), 0) || 0;
        });

        const totalSkipped = computed(() => {
            return props.dataTable?.reduce((total, item) => total + (item.result.scenariosSkipped || 0), 0) || 0;
        });

        const totalPending = computed(() => {
            return props.dataTable?.reduce((total, item) => total + (item.result.scenariosPending || 0), 0) || 0;
        });

        const totalUndefined = computed(() => {
            return props.dataTable?.reduce((total, item) => total + (item.result.scenariosUndefined || 0), 0) || 0;
        });

        const totalAmbiguous = computed(() => {
            return props.dataTable?.reduce((total, item) => total + (item.result.scenariosAmbiguous || 0), 0) || 0;
        });

        return {
            selectedYear,
            selectYear,
            dataLabels,
            selectedDashboard,
            selectDashboard,
            totalScenarios,
            totalPassed,
            totalFailed,
            totalSkipped,
            totalPending,
            totalUndefined,
            totalAmbiguous
        };
    },
});
</script>
<style scoped></style>
