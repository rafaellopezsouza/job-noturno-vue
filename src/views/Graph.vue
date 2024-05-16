<template>
  <div class="graph">
    <div class="tabs">
      <tab class="tab" :class="{ active: activeTab === 'daily' }" @click="changeTab('daily')">Diário</tab>
      <tab class="tab" :class="{ active: activeTab === 'monthly' }" @click="changeTab('monthly')">Mensal</tab>
      <tab class="tab" :class="{ active: activeTab === 'annual' }" @click="changeTab('annual')">Anual</tab>
    </div>

    <div v-if="activeTab === 'daily'">
      <h2 class="text"> Gráfico Diário de {{ this.$route.path }}</h2>
      <Daily :datasetLabel="this.$route.path" :dataTable="dataTable" />
    </div>

    <div v-if="activeTab === 'monthly'">
      <h2 class="text">Gráfico Mensal de {{ this.$route.path }}</h2>
      <!-- <Chart :data="monthlyChartData" /> -->
    </div>

    <div v-if="activeTab === 'annual'">
      <h2 class="text">Gráfico Anual de {{ this.$route.path }}</h2>
      <!-- <Chart :data="annualChartData" /> -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { dataTable } from '../assets/dataMock';
import Daily from './Daily.vue';

export default defineComponent({
  name: 'Graph',
  components: {
    Daily
  },
  data() {
    return {
      activeTab: 'daily',
      dataTable,
      tabText: {
        daily: 'Gráfico Diário',
        monthly: 'Gráfico Mensal',
        annual: 'Gráfico Anual'
      },
    };
  },
  methods: {
    changeTab(tab) {
      this.activeTab = tab;
    },
  },
});
</script>

<style>
.graph {
  width: 100%;
  height: 100vh;
}

.tabs {
  display: flex;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  color: var(--text-primary-color);
  margin: 0.5rem;
  border-left: 2px solid transparent;
  border-top: none;
  box-shadow: 0 2px 5px 0 var(--primary-color);
  background-color: var(--secondary-color);
  border-radius: 10px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tab:hover {
  background-color: var(--primary-color);
  color: var(--text-secondary-color);
}

.tab.active {
  background-color: var(--primary-color);
  color: var(--text-secondary-color);
}


.text {
  color: var(--text-primary-color);
}
</style>
