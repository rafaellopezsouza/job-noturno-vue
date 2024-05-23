<template>
    <div class="chart-line">
        <Chart type="line" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Chart from 'primevue/chart';
import { Chart as ChartJS, registerables } from 'chart.js';
import { labelsGraphs } from "../assets/data"


ChartJS.register(...registerables);

const props = defineProps({
    labels: { type: Array, required: true },
    totalPassed: { type: Number, default: 0 },
    totalFailed: { type: Number, default: 0 },
    totalSkipped: { type: Number, default: 0 },
    totalScenarios: { type: Number, default: 0 },
    totalPending: { type: Number, default: 0 },
    totalUndefined: { type: Number, default: 0 },
    totalAmbiguous: { type: Number, default: 0 },
});

const chartData = ref(setChartData());
const chartOptions = ref(setChartOptions());

function setChartData() {
    const documentStyle = getComputedStyle(document.body);
    const color = {
        passed: documentStyle.getPropertyValue('--passed'),
        failed: documentStyle.getPropertyValue('--failed'),
        skipped: documentStyle.getPropertyValue('--skipped'),
        pending: documentStyle.getPropertyValue('--pending'),
        undefined: documentStyle.getPropertyValue('--undefined'),
        ambiguous: documentStyle.getPropertyValue('--ambiguous'),
    };

    return {
        labels: props.labels,
        datasets: [
            {
                label: labelsGraphs.passed,
                data: props.totalPassed,
                borderColor: color.passed,
                fill: false,
            },
            {
                label: labelsGraphs.failed,
                data: props.totalFailed,
                borderColor: color.failed,
                fill: false,
            },
            {
                label: labelsGraphs.skipped,
                data: props.totalSkipped,
                borderColor: color.skipped,
                fill: false,
            },
            {
                label: labelsGraphs.pending,
                data: props.totalPending,
                borderColor: color.pending,
                fill: false,
            },
            {
                label: labelsGraphs.undefined,
                data: props.totalUndefined,
                borderColor: color.undefined,
                fill: false,
            },
            {
                label: labelsGraphs.ambiguous,
                data: props.totalAmbiguous,
                borderColor: color.ambiguous,
                fill: false,
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
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)',
                }
            },
            y: {
                ticks: {
                    color: textColor,
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)',
                }
            }
        }
    };
}

watch(
    () => [props.totalPassed, props.totalFailed, props.totalSkipped, props.totalPending, props.totalUndefined, props.totalAmbiguous, props.labels],
    () => {
        chartData.value = setChartData();
    },
    { immediate: true }
);
</script>

<style scoped>
.chart-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 20rem;
}
</style>
