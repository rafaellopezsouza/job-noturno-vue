<template>
    <div class="monthly">
        <div class="filter-options">
            <Dropdown id="select-month" class="dropdown-month" v-model="selectedMonth" :options="selectMonth"
                optionLabel="month" placeholder="Selecione o mês" />
            <Dropdown id="select-dashboard" v-model="selectedDashboard" :options="selectDashboard" optionLabel="name"
                placeholder="Selecione um Dashboard" />
        </div>
        <hr>
        <div class="chart-line"  v-if="scenariosTotal > 0">
            <ChartLine :labels="dataLabels" :totalScenarios="scenariosTotal" :totalPassed="passedTotal"
                :totalFailed="failedTotal" :totalSkipped="skippedTotal" :totalPending="pendingTotal"
                :totalUndefined="undefinedTotal" :totalAmbiguous="ambiguousTotal" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, computed } from 'vue';
import Dropdown from 'primevue/dropdown';
import ChartLine from "../components/ChartLine.vue";
import { months } from "../assets/data";
import { getByDashboard, getByDashboardAndDate, getByDate } from "../services/api";

interface Month {
    month: string;
    code: string;
}

interface DashboardProps {
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
        const selectedMonth = ref<Month | null>(null);
        const selectedDashboard = ref<DashboardProps | null>(null);

        const selectMonth = ref<Month[]>(months);
        const selectDashboard = ref<DashboardProps[]>([]);

        const passedTotal = ref<number>(0);
        const failedTotal = ref<number>(0);
        const skippedTotal = ref<number>(0);
        const pendingTotal = ref<number>(0);
        const undefinedTotal = ref<number>(0);
        const ambiguousTotal = ref<number>(0);
        const scenariosTotal = ref<number>(0);

        const fetchDashboardNames = async () => {
            if (props.path !== undefined) {
                const dashboardData = await getByDashboard({ project: props.path });
                const dataFromAPI = dashboardData.map((name: string) => ({ name }));
                selectDashboard.value = [{ name: "Todos" }, ...dataFromAPI];
            }
        };

        watch([selectedMonth, selectedDashboard], async ([month, dashboard]) => {
            if (month && dashboard) {
                fetchData(month.code, dashboard);
            }
        });

        onMounted(() => {
            fetchDashboardNames();
        });

        const fetchData = async (month: string, dashboard: DashboardProps) => {
            try {
                const startDate = `${new Date().getFullYear()}-${month}-01`;
                const endDate = `${new Date().getFullYear()}-${month}-31`;
                let dashboardData;
                if (props.path) {
                    if (dashboard.name === "Todos") {
                        dashboardData = await getByDate({
                            project: props.path,
                            startDate,
                            endDate
                        });
                    } else {
                        dashboardData = await getByDashboardAndDate({
                            project: props.path,
                            dashboardName: dashboard.name,
                            startDate,
                            endDate
                        });
                    }
                }
                calculateTotals(dashboardData);
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
            }
        };

        const calculateTotals = (dashboardData: DataTableItem[]) => {
            passedTotal.value = dashboardData.reduce((total, item) => total + (item.result.scenariosPassed || 0), 0);
            failedTotal.value = dashboardData.reduce((total, item) => total + (item.result.scenariosFailed || 0), 0);
            skippedTotal.value = dashboardData.reduce((total, item) => total + (item.result.scenariosSkipped || 0), 0);
            pendingTotal.value = dashboardData.reduce((total, item) => total + (item.result.scenariosPending || 0), 0);
            undefinedTotal.value = dashboardData.reduce((total, item) => total + (item.result.scenariosUndefined || 0), 0);
            ambiguousTotal.value = dashboardData.reduce((total, item) => total + (item.result.scenariosAmbiguous || 0), 0);
            scenariosTotal.value = dashboardData.reduce((total, item) => total + (item.result.scenariosTotal || 0), 0);
        };

        const dataLabels = computed(() => {
            return props.dataTable.map(data => new Date(data.date).getDate().toString().padStart(2, '0'));
        });

        return {
            selectedMonth,
            selectMonth,
            selectedDashboard,
            selectDashboard,
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
