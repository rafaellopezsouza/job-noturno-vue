<template>
    <div class="filter-options">
        <p>{{ path }}</p>
        <Calendar v-model="selectedDate" showIcon dateFormat="dd/mm/yy" inputId="selectDate"
            placeholder="Selecione uma data" />
        <Dropdown id="select-Feature" v-model="selectedFeature" :options="selectFeature" optionLabel="name"
            placeholder="Selecione uma Funcionalidade" />
    </div>
    <hr>
    <div v-if="totalScenarios > 0">
        <ChartPie :totalScenarios="totalScenarios" :totalFailed="totalFailed" :totalPassed="totalPassed"
            :totalSkipped="totalSkipped" :totalPending="totalPending" :totalUndefined="totalUndefined"
            :totalAmbiguous="totalAmbiguous" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, Ref } from 'vue';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import ChartPie from "../ChartPie.vue";
import { getFeatures, getByFeatureAndDate, getByDate } from "../../services/api";

interface FeatureProps {
    name: string;
}

interface DataTableItem {
    date: string;
    result: {
        scenariosTotal: number;
        scenariosFailed: number;
        scenariosPassed: number;
        scenariosSkipped: number;
        scenariosPending: number;
        scenariosUndefined: number;
        scenariosAmbiguous: number;
    };
}

export default defineComponent({
    name: 'Daily',
    components: {
        Calendar,
        Dropdown,
        ChartPie,
    },
    props: {
        path: {
            type: String,
            required: true
        },
        dataTable: {
            type: Array as () => DataTableItem[],
            required: true
        }
    },
    setup(props) {
        const selectedDate = ref<Date | null>(null);
        const selectedFeature = ref<FeatureProps | null>(null);
        const selectFeature = ref<FeatureProps[]>([]);
        const totalScenarios: Ref<number> = ref(0);
        const totalFailed: Ref<number> = ref(0);
        const totalPassed: Ref<number> = ref(0);
        const totalSkipped: Ref<number> = ref(0);
        const totalPending: Ref<number> = ref(0);
        const totalUndefined: Ref<number> = ref(0);
        const totalAmbiguous: Ref<number> = ref(0);
        console.log("PATH: " + props.path)

        const fetchFeaturesNames = async () => {
            if (props.path != "/") {
                try {
                    const FeatureData = await getFeatures({ project: props.path });
                    const dataFromAPI = FeatureData.map((name: string) => ({ name }));
                    selectFeature.value = [{ name: "Todos" }, ...dataFromAPI];
                } catch (error) {
                    console.error("Erro ao buscar nomes do Feature:", error);
                }
            }
        };

        const fetchData = async (date: Date, feature: FeatureProps) => {
            try {
                const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                const formattedDate = nextDay.toISOString().split('T')[0];
                let featureData;
                if (feature.name === "Todos") {
                    featureData = await getByDate({
                        project: props.path,
                        startDate: formattedDate,
                        endDate: formattedDate
                    });
                } else {
                    featureData = await getByFeatureAndDate({
                        project: props.path,
                        featureName: feature.name,
                        startDate: formattedDate,
                        endDate: formattedDate
                    });
                }
                updateData(featureData);
            } catch (error) {
                console.error("Erro ao buscar dados do feature:", error);
            }
        };

        const updateData = (featureData: DataTableItem[]) => {
            totalScenarios.value = featureData.reduce((total, item) => total + (item.result.scenariosTotal || 0), 0);
            totalFailed.value = featureData.reduce((total, item) => total + (item.result.scenariosFailed || 0), 0);
            totalPassed.value = featureData.reduce((total, item) => total + (item.result.scenariosPassed || 0), 0);
            totalSkipped.value = featureData.reduce((total, item) => total + (item.result.scenariosSkipped || 0), 0);
            totalPending.value = featureData.reduce((total, item) => total + (item.result.scenariosPending || 0), 0);
            totalUndefined.value = featureData.reduce((total, item) => total + (item.result.scenariosUndefined || 0), 0);
            totalAmbiguous.value = featureData.reduce((total, item) => total + (item.result.scenariosAmbiguous || 0), 0);
        };

        watch([selectedDate, selectedFeature], ([date, feature]) => {
            if (date && feature) {
                fetchData(date, feature);
            }
            fetchFeaturesNames();
        });

        return {
            selectedDate,
            selectedFeature,
            selectFeature,
            totalScenarios,
            totalFailed,
            totalPassed,
            totalSkipped,
            totalPending,
            totalUndefined,
            totalAmbiguous
        };
    },
});
</script>

<style scoped></style>
