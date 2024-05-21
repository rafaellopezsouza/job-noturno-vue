<template>
    <div class="chart">
        <Chart type="line" :data="chartData" :options="chartOptions" class="chart-line" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import Chart from 'primevue/chart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables, ChartDataLabels);

const props = defineProps({
    labels: Array,
    totalPassed: { type: Number, default: 0 },
    totalFailed: { type: Number, default: 0 },
    totalSkipped: { type: Number, default: 0 },
    totalScenarios: { type: Number, default: 0 },
    totalPending: { type: Number, default: 0 },
    totalUndefined: { type: Number, default: 0 },
    totalAmbiguous: { type: Number, default: 0 },
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const color = {
        total: documentStyle.getPropertyValue('--blue-500'),
        passed: documentStyle.getPropertyValue('--passed'),
        failed: documentStyle.getPropertyValue('--failed'),
        skipped: documentStyle.getPropertyValue('--skipped'),
        pending: documentStyle.getPropertyValue('--pending'),
        undefined: documentStyle.getPropertyValue('--undefined'),
        ambiguous: documentStyle.getPropertyValue('--ambiguous'),
    }
    //Aguardar API buscar por data e Substituir o data com um map que virá da API
    return {
        labels: props.labels,
        datasets: [
            {
                label: 'Total',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                tension: 0.4,
                backgroundColor: color.total,
                borderColor: color.total,
                color: color.total,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: color.total,
                }
            },
            {
                label: 'Passou',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                tension: 0.4,
                backgroundColor: color.passed,
                borderColor: color.passed,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: color.passed,
                }
            },
            {
                label: 'Falhou',
                data: [8, 8, 0, 9, 6, 7, 0],
                fill: false,
                tension: 0.4,
                backgroundColor: color.failed,
                borderColor: color.failed,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: color.failed,
                }
            },
            {
                label: 'Não Executou',
                data: [2, 4, 4, 1, 8, 2, 9],
                fill: false,
                tension: 0.4,
                backgroundColor: color.skipped,
                borderColor: color.skipped,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: color.skipped,
                }
            },
            {
                label: 'Pendente',
                data: [2, 4, 4, 1, 8, 2, 9],
                fill: false,
                tension: 0.4,
                backgroundColor: color.pending,
                borderColor: color.pending,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: color.pending,
                }
            },
            {
                label: 'Indefinido',
                data: [2, 4, 4, 1, 8, 2, 9],
                fill: false,
                tension: 0.4,
                backgroundColor: color.undefined,
                borderColor: color.undefined,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: color.undefined,
                }
            },
            {
                label: 'AMBÍGUO',
                data: [2, 4, 4, 1, 8, 2, 9],
                fill: false,
                tension: 0.4,
                backgroundColor: color.ambiguous,
                borderColor: color.ambiguous,
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    color: color.ambiguous,
                }
            },
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
};

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<style scoped>

.chart-line {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
}
</style>
