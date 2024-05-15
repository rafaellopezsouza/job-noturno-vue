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
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  height: 50px;
}

.link-header {
  display: block;
  padding: 10px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s;
}
</style>