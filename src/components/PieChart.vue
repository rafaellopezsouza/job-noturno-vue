<template>
    <div>
        <canvas ref="chartCanvas" width="400" height="400"></canvas>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
export default defineComponent({
    name: 'Daily',
    props: {
        totalPassed: Number,
        totalFailed: Number,
        totalSkipped: Number,
        totalScenarios: Number
    },
    mounted() {
        this.renderChart();
    },
    methods: {
        renderChart() {
            const chartData = {
                labels: ['Passou', 'Falhou', 'Não executou'],
                datasets: [{
                    data: [
                        this.totalPassed,
                        this.totalFailed,
                        this.totalSkipped,
                    ],
                    backgroundColor: [
                        'green',
                        'red',
                        'orange',
                    ],
                    hoverOffset: 4
                }],
            };

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Total Testes: ${this.totalScenarios}`,
                        color: "blue",
                        position: "top",
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    datalabels: {
                        anchor: 'center',
                        font: {
                            weight: 'bold',
                        },
                        color: 'white',
                        formatter: (value, context) => {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return ` ${value}\n(${percentage}%)`;
                        }
                    }
                }
            };

            const ctx = this.$refs.chartCanvas.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'pie',
                    data: chartData,
                    options: chartOptions,
                    plugins: [ChartDataLabels]
                });
            }
        }
    }
})
</script>
<style></style>