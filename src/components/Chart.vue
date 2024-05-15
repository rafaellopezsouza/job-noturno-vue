<template>
    <div>
        <canvas ref="chartCanvas" width="400" height="400"></canvas>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Chart from 'chart.js/auto';

export default defineComponent({
    name: 'Chart',
    mounted() {
        this.renderChart();
    },
    methods: {
        renderChart() {
            const chartData = {
                labels: ['FAILED', 'PASSED', 'SKIPED'],
                datasets: [{
                    label: 'DIÁRIO',
                    data: [12, 19, 3],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(75, 192, 192)',
                        'rgb(255, 205, 86)',
                    ],
                    hoverOffset: 4
                }]
            };

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false
            };

            const ctx = this.$refs.chartCanvas.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'pie',
                    data: chartData,
                    options: chartOptions
                });
            }
        }
    }
});
</script>

<style scoped>
/* Estilos opcionais */
</style>
