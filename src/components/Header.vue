<template>
  <div class="header">
    <router-link class="link-home" :to="item.link" v-for="item in items" :key="item.label">
      {{ item.label }}
    </router-link>
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
  background: var(--primary-color);
  color: var(--text-secondary-color);
  padding: .5rem 0;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: auto;
  z-index: 60;
  padding: 1.5rem 0;
  min-height: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.link-home {
  background-color: var(--primary-color);
  color: var(--text-secondary-color);
  text-decoration: none;
  padding: 1rem 2rem 1rem 2rem;
  margin-left: 3rem;
}

.link-home:hover {
  border-radius: 2.5rem;
  background-color: rgba(255, 255, 255, 0.25);
}
</style>
