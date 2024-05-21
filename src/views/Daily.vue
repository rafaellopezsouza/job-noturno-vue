<template>
    <div class="filter-options">
        <Calendar v-model="date" showIcon dateFormat="dd/mm/yy" inputId="selectDate" placeholder="Selecione uma data" />
        <Dropdown id="select-dashboard" v-model="selectedDashboard" :options="selectDashboard" optionLabel="name"
            placeholder="Selecione um Dashboard" />
    </div>
    <hr>
    <div>
        <ChartPie :totalScenarios="totalScenarios" :totalFailed="totalFailed" :totalPassed="totalPassed"
            :totalSkipped="totalSkipped" :totalPending="totalPending" :totalUndefined="totalUndefined"
            :totalAmbiguous="totalAmbiguous" />
        <!-- <Table :dataTable="dataTable" /> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import ChartPie from "../components/ChartPie.vue";
import Table from "../components/Table.vue";
import { dashboardName } from "../assets/dataMock";

interface DashboardProps {
    name: string;
}

export default defineComponent({
    name: 'Daily',
    components: {
        Calendar,
        Dropdown,
        ChartPie,
        Table
    },
    props: {
        path: String,
        dataTable: {
            type: Array as () => Array<{ date: string, result: any }>,
            required: true
        }
    },
    setup() {
        const date = ref<Date | null>(null);
        const selectedDashboard = ref<DashboardProps | null>(null);
        const selectDashboard = ref<DashboardProps[]>([]);

        const fetchDashboardNames = async () => {
            // Simulando a obtenção de dados da API
            setTimeout(() => {
                const dataFromAPI = dashboardName.map(name => ({ name }));
                selectDashboard.value = [{ name: "Todos" }, ...dataFromAPI];
            }, 1000);
        };

        onMounted(() => {
            fetchDashboardNames();
        });

        return { date, selectedDashboard, selectDashboard };
    },
    computed: {
        totalScenarios() {
            return this.dataTable.reduce((total, item) => total + (item.result.scenariosTotal || 0), 0);
        },
        totalPassed() {
            return this.dataTable.reduce((total, item) => total + (item.result.scenariosPassed || 0), 0);
        },
        totalFailed() {
            return this.dataTable.reduce((total, item) => total + (item.result.scenariosFailed || 0), 0);
        },
        totalSkipped() {
            return this.dataTable.reduce((total, item) => total + (item.result.scenariosSkipped || 0), 0);
        },
        totalPending() {
            return this.dataTable.reduce((total, item) => total + (item.result.scenariosPending || 0), 0);
        },
        totalUndefined() {
            return this.dataTable.reduce((total, item) => total + (item.result.scenariosUndefined || 0), 0);
        },
        totalAmbiguous() {
            return this.dataTable.reduce((total, item) => total + (item.result.scenariosAmbiguous || 0), 0);
        }
    }
});
</script>

<style scoped></style>
