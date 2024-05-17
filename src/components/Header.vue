<template>
  <div class="header">
    <Menubar :model="items">
      <router-link :to="item.link" v-for="item in items" :key="item.label" class="menubar-item">
        {{ item.label }}
      </router-link>
    </Menubar>
  </div>
</template>

<script>
import { ref } from "vue";
import Menubar from 'primevue/menubar';

export default {
  name: 'Header',
  components: {
    Menubar,
  },
  setup() {
    const items = ref([
      {
        label: 'Home',
        icon: 'pi pi-home',
        link: "/"
      }
    ]);
    return { items };
  }
};
</script>

<style scoped>
.header {
  color: var(--text-secondary-color);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  height: 50px;
}

.menubar-item {
  /* Adicione estilos para os itens do menubar, se necessário */
}
</style>
