<template>
  <div class="graph-view">
    <TabView>
      <TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
        <div v-if="tab.content === 'daily'">
          <h2 class="text"> Gráfico Diário de {{ $route.path }}</h2>
          <Daily :path="$route.path" :dataTable="dataTable" />
        </div>
        <div v-if="tab.content === 'monthly'">
          <h2 class="text">Gráfico Mensal de {{ $route.path }}</h2>
          <Monthly :path="$route.path" :dataTable="dataTable" />
        </div>
        <div v-if="tab.content === 'annual'">
          <h2 class="text">Gráfico Anual de {{ $route.path }}</h2>
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
import Monthly from './Monthly.vue';
import { dataTable } from '../assets/dataMock';

const tabs = ref([
  { title: 'Diário', content: 'daily' },
  { title: 'Mensal', content: 'monthly' },
  { title: 'Anual', content: 'annual' }
]);

</script>
