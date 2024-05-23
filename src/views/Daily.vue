<template>
    <div class="filter-options">
        <Calendar v-model="selectedDate" showIcon dateFormat="dd/mm/yy" inputId="selectDate"
            placeholder="Selecione uma data" />
        <Dropdown id="select-dashboard" v-model="selectedDashboard" :options="selectDashboard" optionLabel="name"
            placeholder="Selecione um Dashboard" />
    </div>
    <hr>
    <div v-if="totalScenarios > 0">
        <ChartPie :totalScenarios="totalScenarios" :totalFailed="totalFailed" :totalPassed="totalPassed"
            :totalSkipped="totalSkipped" :totalPending="totalPending" :totalUndefined="totalUndefined"
            :totalAmbiguous="totalAmbiguous" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, Ref } from 'vue';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import ChartPie from "../components/ChartPie.vue";
import { getByDashboard, getByDashboardAndDate, getByDate } from "../services/api";

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
    name: 'Daily',
    components: {
        Calendar,
        Dropdown,
        ChartPie,
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
        const selectedDate = ref<Date | null>(null);
        const selectedDashboard = ref<DashboardProps | null>(null);
        const selectDashboard = ref<DashboardProps[]>([]);
        const totalScenarios: Ref<number> = ref(0);
        const totalFailed: Ref<number> = ref(0);
        const totalPassed: Ref<number> = ref(0);
        const totalSkipped: Ref<number> = ref(0);
        const totalPending: Ref<number> = ref(0);
        const totalUndefined: Ref<number> = ref(0);
        const totalAmbiguous: Ref<number> = ref(0);

        const fetchDashboardNames = async () => {
            if (props.path) {
                const dashboardData = await getByDashboard({ project: props.path });
                const dataFromAPI = dashboardData.map((name: string) => ({ name }));
                selectDashboard.value = [{ name: "Todos" }, ...dataFromAPI];
            }
        };

        onMounted(() => {
            fetchDashboardNames();
        });

        watch([selectedDate, selectedDashboard], async ([date, dashboard]) => {
            if (date && dashboard) {
                fetchData(date, dashboard);
            }
        });

        const fetchData = async (date: Date, dashboard: DashboardProps) => {
            try {
                const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                const formattedDate = nextDay.toISOString().split('T')[0];
                let dashboardData;
                if (dashboard.name === "Todos") {
                    dashboardData = await getByDate({
                        project: props.path,
                        startDate: formattedDate,
                        endDate: formattedDate
                    });
                } else {
                    dashboardData = await getByDashboardAndDate({
                        project: props.path,
                        dashboardName: dashboard.name,
                        startDate: formattedDate,
                        endDate: formattedDate
                    });
                }
                updateData(dashboardData);
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
            }
        };

        const updateData = (dashboardData: DataTableItem[]) => {
            totalScenarios.value = dashboardData.reduce((total, item) => total + (item.result.scenariosTotal || 0), 0);
            totalFailed.value = dashboardData.reduce((total, item) => total + (item.result.scenariosFailed || 0), 0);
            totalPassed.value = dashboardData.reduce((total, item) => total + (item.result.scenariosPassed || 0), 0);
            totalSkipped.value = dashboardData.reduce((total, item) => total + (item.result.scenariosSkipped || 0), 0);
            totalPending.value = dashboardData.reduce((total, item) => total + (item.result.scenariosPending || 0), 0);
            totalUndefined.value = dashboardData.reduce((total, item) => total + (item.result.scenariosUndefined || 0), 0);
            totalAmbiguous.value = dashboardData.reduce((total, item) => total + (item.result.scenariosAmbiguous || 0), 0);
        };

        return {
            selectedDate,
            selectedDashboard,
            selectDashboard,
            totalScenarios,
            totalFailed,
            totalPassed,
            totalSkipped,
            totalPending,
            totalUndefined,
            totalAmbiguous
        };
    },
});
</script>

<style scoped></style>
