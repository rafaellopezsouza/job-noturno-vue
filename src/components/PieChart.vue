<template>
    <div class="card flex justify-content-center">
        <div class="chart-label">Total Scenarios: {{ props.totalScenarios }}</div>
        <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import Chart from 'primevue/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables, ChartDataLabels);

const props = defineProps({
    totalPassed: Number,
    totalFailed: Number,
    totalSkipped: Number,
    totalScenarios: Number
});

const chartData = ref(null);
const chartOptions = ref(null);

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);

    return {
        labels: ['PASSOU', 'FALHOU', 'PULOU'],
        datasets: [
            {
                data: [props.totalPassed, props.totalFailed, props.totalSkipped],
                backgroundColor: [
                    documentStyle.getPropertyValue('--green-500'),
                    documentStyle.getPropertyValue('--red-500'),
                    documentStyle.getPropertyValue('--yellow-500'),
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--green-400'),
                    documentStyle.getPropertyValue('--red-400'),
                    documentStyle.getPropertyValue('--yellow-400'),
                ]
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
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return ` ${value}\n(${percentage}%)`;
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
    () => [props.totalPassed, props.totalFailed, props.totalSkipped],
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
.card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.chart-label {
    font-size: 16px;
    margin-bottom: 1rem;
    color: blue;
}
</style>
