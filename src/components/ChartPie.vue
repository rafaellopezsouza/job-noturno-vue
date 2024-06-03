<template>
    <div class="graph-area">
        <h3 class="chart-label">Total Scenarios: {{ totalScenarios }}</h3>
        <Chart class="chart-pie" type="pie" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Chart from 'primevue/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';
import { labelsGraphs } from "../assets/data"

ChartJS.register(...registerables, ChartDataLabels);

const props = defineProps({
    totalPassed: { type: Number, default: 0 },
    totalFailed: { type: Number, default: 0 },
    totalSkipped: { type: Number, default: 0 },
    totalScenarios: { type: Number, default: 0 },
    totalPending: { type: Number, default: 0 },
    totalUndefined: { type: Number, default: 0 },
    totalAmbiguous: { type: Number, default: 0 },
    duration: { type: String, default: "0h 0m 0s" },
});

const chartData = ref(setChartData());
const chartOptions = ref(setChartOptions());

function setChartData() {
    const documentStyle = getComputedStyle(document.body);
    const color = {
        total: documentStyle.getPropertyValue('--blue-500'),
        passed: documentStyle.getPropertyValue('--passed'),
        failed: documentStyle.getPropertyValue('--failed'),
        skipped: documentStyle.getPropertyValue('--skipped'),
        pending: documentStyle.getPropertyValue('--pending'),
        undefined: documentStyle.getPropertyValue('--undefined'),
        ambiguous: documentStyle.getPropertyValue('--ambiguous'),
    };

    return {
        labels: [labelsGraphs.passed, labelsGraphs.failed, labelsGraphs.skipped, labelsGraphs.pending, labelsGraphs.undefined, labelsGraphs.ambiguous],
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
}

function setChartOptions() {
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
}

watch(
    () => [props.totalPassed, props.totalFailed, props.totalSkipped, props.totalPending, props.totalUndefined, props.totalAmbiguous],
    () => {
        chartData.value = setChartData();
    },
    { immediate: true }
);
</script>

<style scoped>
.graph-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 20rem;
    width: 200vh;
}

.chart-pie {
    height: 300px;
    width: 500px;
}

.chart-label {
    font-size: 16px;
    margin: 2rem;
    color: var(--total);
}
</style>
