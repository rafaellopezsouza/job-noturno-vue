<template>
    <div class="filter-options">
        <Dropdown id="select-month" class="dropdown-month" v-model="selectedMonth" :options="selectMonth"
            optionLabel="month" placeholder="Selecione o mês" />
        <Dropdown id="select-dashboard" v-model="selectedDashboard" :options="selectDashboard" optionLabel="name"
            placeholder="Selecione um Dashboard" />

        <!-- Para teste se os dados estão sendo capturados. Remover o Label após concluir lógica para API -->
        <!-- inicio remover -->
        <label v-if="selectedMonth || selectedDashboard">
            <strong>Remover após implementar:</strong><br>
            Mês Selecionado: <strong>{{ selectedMonth?.month }}</strong><br>
            CodeMesSelecionado: <strong>{{ selectedMonth?.code }}</strong><br>
            Dashboard Selecionado: {{ selectedDashboard?.name }}
        </label>
        <!-- fim remover -->
        <hr>
        <div class="chart-line">
            <ChartLine :labels="monthLabels" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import Dropdown from 'primevue/dropdown';
import ChartLine from "../components/ChartLine.vue";
import { dashboardName } from "../assets/dataMock";

interface Month {
    month: string;
    code: string;
}

interface Dashboard {
    name: string;
}

export default defineComponent({
    name: 'Monthly',
    components: {
        Dropdown,
        ChartLine
    },
    props: {
        path: String,
        dataTable: Array,
        selectMonth: {
            type: Array as () => Month[],
            required: true,
            default: () => []
        }
    },
    setup(props) {
        const selectedMonth = ref<Month | null>(null);
        const selectedDashboard = ref<Dashboard | null>(null);

        const selectMonth = ref<Month[]>([
            { month: 'Janeiro', code: "01" },
            { month: 'Fevereiro', code: "02" },
            { month: 'Março', code: "03" },
            { month: 'Abril', code: "04" },
            { month: 'Maio', code: "05" },
            { month: 'Junho', code: "06" },
            { month: 'Julho', code: "07" },
            { month: 'Agosto', code: "08" },
            { month: 'Setembro', code: "09" },
            { month: 'Outubro', code: "10" },
            { month: 'Novembro', code: "11" },
            { month: 'Dezembro', code: "12" },
        ]);

        const selectDashboard = ref<Dashboard[]>([]);
        const fetchDashboardNames = async () => {
            // Simulando a obtenção de dados da API
            setTimeout(() => {
                selectDashboard.value = dashboardName.map(name => ({ name }));
            }, 1000);
        };

        onMounted(() => {
            fetchDashboardNames();
        });

        const totalScenarios = computed(() => {
            return props.dataTable?.reduce((total, item: any) => total + (item.result.scenariosTotal || 0), 0) || 0;
        });

        const totalPassed = computed(() => {
            return props.dataTable?.reduce((total, item: any) => total + (item.result.scenariosPassed || 0), 0) || 0;
        });

        const totalFailed = computed(() => {
            return props.dataTable?.reduce((total, item: any) => total + (item.result.scenariosFailed || 0), 0) || 0;
        });

        const totalSkipped = computed(() => {
            return props.dataTable?.reduce((total, item: any) => total + (item.result.scenariosSkipped || 0), 0) || 0;
        });

        const totalPending = computed(() => {
            return props.dataTable?.reduce((total, item: any) => total + (item.result.scenariosPending || 0), 0) || 0;
        });

        const totalUndefined = computed(() => {
            return props.dataTable?.reduce((total, item: any) => total + (item.result.scenariosUndefined || 0), 0) || 0;
        });

        const totalAmbiguous = computed(() => {
            return props.dataTable?.reduce((total, item: any) => total + (item.result.scenariosAmbiguous || 0), 0) || 0;
        });

        const monthLabels = computed(() => selectMonth.value.map(month => month.month));

        return {
            selectedMonth,
            selectMonth,
            monthLabels,
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

<style scoped>
.filter-options {
    margin: auto;
}

.dropdown-month {
    margin: 1rem;
}
</style>
