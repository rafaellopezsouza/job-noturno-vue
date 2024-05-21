<template>
    <div class="chart-pie">
        <div class="chart-label">Total Scenarios: {{ props.totalScenarios }}</div>
        <Chart type="pie" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import Chart from 'primevue/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables, ChartDataLabels);

const props = defineProps({
    totalPassed: { type: Number, default: 0 },
    totalFailed: { type: Number, default: 0 },
    totalSkipped: { type: Number, default: 0 },
    totalScenarios: { type: Number, default: 0 },
    totalPending: { type: Number, default: 0 },
    totalUndefined: { type: Number, default: 0 },
    totalAmbiguous: { type: Number, default: 0 },
});


const chartData = ref(null);
const chartOptions = ref(null);

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);
    const color = {
        total: documentStyle.getPropertyValue('--blue-500'),
        passed: documentStyle.getPropertyValue('--passed'),
        failed: documentStyle.getPropertyValue('--failed'),
        skipped: documentStyle.getPropertyValue('--skipped'),
        pending: documentStyle.getPropertyValue('--pending'),
        undefined: documentStyle.getPropertyValue('--undefined'),
        ambiguous: documentStyle.getPropertyValue('--ambiguous'),
    }

    return {
        labels: ['PASSOU', 'FALHOU', 'NÃO EXECUTOU', "PENDENTE", "INDEFINIDO", "AMBÍGUO"],
        datasets: [
            {
                data: [props.totalPassed, props.totalFailed, props.totalSkipped, props.totalPending, props.totalUndefined, props.totalAmbiguous],
                backgroundColor: [
                    color.passed,
                    color.failed,
                    color.skipped,
                    color.pending,
                    color.undefined,
                    color.ambiguous,
                ],
                hoverOffset: 5,
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor,
                }
            },
            datalabels: {
                color: '#fff',
                formatter: (value, context) => {
                    const total = context.dataset.data.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);
                    if (total === 0) {
                        return `${value}`;
                    } else {
                        const percentage = Math.round((value / total) * 100);
                        return ` ${value}\n(${percentage}%)`;
                    }
                },
                font: {
                    weight: 'bold',
                    size: 12
                }
            }
        }
    };
};

watch(
    () => [props.totalPassed, props.totalFailed, props.totalSkipped, props.totalPending, props.totalUndefined, props.totalAmbiguous],
    () => {
        chartData.value = setChartData();
    },
    { immediate: true }
);

onMounted(() => {
    chartOptions.value = setChartOptions();
});
</script>

<style scoped>
.chart-pie {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 20rem;
}

.chart-label {
    font-size: 16px;
    margin: 2rem;
    color: var(--total);
}
</style>
