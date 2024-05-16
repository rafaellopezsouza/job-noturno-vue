<template>
    <table class="table">
        <thead class="table-title">
            <tr>
                <th>Tag Test</th>
                <th class="table-total">Total</th>
                <th class="table-passed">Passed</th>
                <th class="table-failed">Failed</th>
                <th class="table-skipped">Skiped</th>
                <th class="table-time">Time (horas)</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in dataTable" :key="index" class="table-body">
                <td class="table-title">{{ item.dashboardName }}</td>
                <td class="table-total">{{ item.result.scenariosTotal }}</td>
                <td class="table-passed">{{ item.result.scenariosPassed }}</td>
                <td class="table-failed">{{ item.result.scenariosFailed }}</td>
                <td class="table-skipped">{{ item.result.scenariosSkipped }}</td>
                <td class="table-time">{{ convertToMinutes(item.result.duration) }}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th class="">Total</th>
                <th class="">{{ totalScenarios }}</th>
                <th class="">{{ totalPassed }}</th>
                <th class="">{{ totalFailed }}</th>
                <th class="">{{ totalSkipped }}</th>
                <th class="">{{ totalTime }}</th>
            </tr>
        </tfoot>
    </table>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Daily',
    props: {
        dataTable: Array,
    },
    computed: {
        totalScenarios() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosTotal, 0);
        },
        totalPassed() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosPassed, 0);
        },
        totalFailed() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosFailed, 0);
        },
        totalSkipped() {
            return this.dataTable.reduce((total, item) => total + item.result.scenariosSkipped, 0);
        },

        //Refazer lógica para exibir o tempo
        totalTime() {
            const totalMilliseconds = this.dataTable.reduce((total, item) => total + item.result.duration, 0);
            // const totalMinutes = (totalMilliseconds / 60000).toFixed(0);
            return `${totalMilliseconds} min`;
        }
    },
    methods: {
        convertToMinutes(milliseconds) {
            // const minutes = (milliseconds / 60000).toFixed(0);
            return `${milliseconds} min`;
        },
    }
})

</script>
<style>
.table {
    background-color: rgba(0, 0, 0, 0.2);
}

.grid-daily {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 20px
}

.title-graph {
    color: var(--text-primary-color);
}

.table-body {
    background-color: var(--secondary-color);
    text-align: center;
}

.table-title {
    color: var(--text-primary-color);
}

.table-passed {
    color: green;
}

.table-failed {
    color: red;
}

.table-total {
    color: blue;
}

.table-skipped {
    color: orange;
}

.table-time {
    color: blueviolet;
}
</style>