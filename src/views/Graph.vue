<template>
  <div class="card">
    <TabView>
      <TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
        <div v-if="tab.content === 'daily'">
          <h2 class="text"> Gráfico Diário de {{ this.$route.path }}</h2>
          <Daily :datasetLabel="this.$route.path" :dataTable="dataTable" />
        </div>

        <div v-if="tab.content === 'monthly'">
          <h2 class="text">Gráfico Mensal de {{ this.$route.path }}</h2>
          <!-- <Chart :data="monthlyChartData" /> -->
        </div>

        <div v-if="tab.content === 'annual'">
          <h2 class="text">Gráfico Anual de {{ this.$route.path }}</h2>
          <!-- <Chart :data="annualChartData" /> -->
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Daily from './Daily.vue';
import { dataTable } from '../assets/dataMock';

const tabs = ref([
  { title: 'Diário', content: 'daily' },
  { title: 'Mensal', content: 'monthly' },
  { title: 'Anual', content: 'annual' }
]);
</script>
