<template>
  <div class="graph">
    <div class="tabs">
      <button class="tab" :class="{ active: activeTab === 'daily' }" @click="changeTab('daily')">Diário</button>
      <button class="tab" :class="{ active: activeTab === 'monthly' }" @click="changeTab('monthly')">Mensal</button>
      <button class="tab" :class="{ active: activeTab === 'annual' }" @click="changeTab('annual')">Anual</button>
    </div>

    <div v-if="activeTab === 'daily'">
      <h2>Gráfico Diário de {{ this.$route.path }}</h2>
      <Chart />
    </div>

    <div v-if="activeTab === 'monthly'">
      <h2>Gráfico Mensal de {{ this.$route.path }}</h2>
      <!-- <Chart :data="monthlyChartData" /> -->
    </div>

    <div v-if="activeTab === 'annual'">
      <h2>Gráfico Anual de {{ this.$route.path }}</h2>
      <!-- <Chart :data="annualChartData" /> -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Chart from '../components/Chart.vue';

export default defineComponent({
  name: 'Graph',
  components: {
    Chart
  },
  data() {
    return {
      activeTab: 'daily',
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
    }
  },
});
</script>

<style scoped>
.graph {
  width: 100%;
  height: 100vh;
}

.tabs {
  display: flex;
  justify-content: space-around;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
}

.tab.active {
  background-color: #ccc;
}
</style>
