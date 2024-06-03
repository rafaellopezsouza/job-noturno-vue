<template>
    <div class="graph-area">
        <Chart class="chart-line" p-chart type="line" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Chart from 'primevue/chart';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { labelsGraphs } from "../assets/data";

// Plugin para espaçamento customizado da legenda
const customLegendSpacing = {
    id: 'customLegendSpacing',
    beforeInit(chart) {
        const fitValue = chart.legend.fit;
        chart.legend.fit = function fit() {
            fitValue.bind(chart.legend)();
            //Define a distancia da Legenda do inicio do Grafico, para os valores totais não sobrepor a legenda.
            this.height += 80;
        };
    }
};

ChartJS.register(...registerables, ChartDataLabels, customLegendSpacing);

const props = defineProps({
    labels: { type: Array, required: true },
    totalPassed: { type: Array, default: () => [] },
    totalFailed: { type: Array, default: () => [] },
    totalSkipped: { type: Array, default: () => [] },
    totalPending: { type: Array, default: () => [] },
    totalUndefined: { type: Array, default: () => [] },
    totalAmbiguous: { type: Array, default: () => [] },
    totalScenarios: { type: Array, default: () => [] },
});

const chartData = ref(setChartData());
const chartOptions = ref(setChartOptions());

function setChartData() {
    const documentStyle = getComputedStyle(document.body);
    const color = {
        total: documentStyle.getPropertyValue('--total'),
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
                label: labelsGraphs.total,
                data: props.totalScenarios,
                borderColor: color.total,
                backgroundColor: color.total,
                fill: false,
            },
            {
                label: labelsGraphs.passed,
                data: props.totalPassed,
                borderColor: color.passed,
                backgroundColor: color.passed,
                fill: false,
            },
            {
                label: labelsGraphs.failed,
                data: props.totalFailed,
                backgroundColor: color.failed,
                borderColor: color.failed,
                fill: false,
            },
            {
                label: labelsGraphs.skipped,
                data: props.totalSkipped,
                backgroundColor: color.skipped,
                borderColor: color.skipped,
                fill: false,
            },
            {
                label: labelsGraphs.pending,
                data: props.totalPending,
                backgroundColor: color.pending,
                borderColor: color.pending,
                fill: false,
            },
            {
                label: labelsGraphs.undefined,
                data: props.totalUndefined,
                backgroundColor: color.undefined,
                borderColor: color.undefined,
                fill: false,
            },
            {
                label: labelsGraphs.ambiguous,
                data: props.totalAmbiguous,
                backgroundColor: color.ambiguous,
                borderColor: color.ambiguous,
                fill: false,
            },
        ],
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    return {
        responsive: true,
        plugins: {
            customLegendSpacing: true,
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor,
                    padding: 20,
                },
            },
            datalabels: {
                display: 'auto',
                align: 'end',
                anchor: 'end',
                offset: 2,
                padding: 4,
                font: {
                    weight: 'bold'
                },
                color: context => context.dataset.borderColor,
                formatter: (value, context) => {
                    if (context.dataset.label === labelsGraphs.total || value === 0) {
                        return `${value}`;
                    } else {
                        const total = context.chart.data.datasets
                            .filter(dataset => dataset.label !== labelsGraphs.total)
                            .reduce((acc, dataset) => acc + dataset.data[context.dataIndex], 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return ` ${value}\n(${percentage}%)`;
                    }
                },
                font: {
                    weight: 'bold',
                    size: 16
                }
            }
        },
        layout: {
            padding: {
                top: 0,
                left: 50,
                right: 50,
                bottom: 250,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(255,255,255)',
                }
            },
            y: {
                ticks: {
                    color: textColor,
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)',
                }
            }
        },
    };
}

watch(
    () => [props.totalScenarios, props.totalPassed, props.totalFailed, props.totalSkipped, props.totalPending, props.totalUndefined, props.totalAmbiguous, props.labels],
    () => {
        chartData.value = setChartData();
    },
    { immediate: true }
);
</script>

<style scoped>
.chart-line {
    height: 400px;
    width: 200vh;
}

.graph-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 2%;
}
</style>
