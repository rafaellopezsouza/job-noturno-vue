<template>
  <div class="header">
    <nav>
      <router-link class="link-header" :to="linkHome">{{ title }}</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: String,
    linkHome: String
  }
}
</script>

<style>
.header {
  background-color: red;
  color: var(--text-secondary-color);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  height: 50px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
}

.link-header {
  display: block;
  padding: 10px;
  color: var(--text-secondary-color);
  text-decoration: none;
  transition: background-color 0.3s;
  width: 70px;
  background-color: var(--primary-color);
  margin: 3px;
  margin-left: 20px;
  text-align: center;
  border-radius: 5px;
}

.link-header:hover {
  scale: 1.05;
}
</style>