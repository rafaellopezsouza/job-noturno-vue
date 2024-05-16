<template>
    <div class="sidebar">
        <ul>
            <li v-for="(link, index) in links" :key="index">
                <router-link :to="link.url" class="btn-sidebar">
                    {{ link.text.toUpperCase() }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Sidebar',
    props: {
        links: Array
    },
}
</script>

<style>
.sidebar {
    position: fixed;
    top: 50px;
    left: 0;
    width: 150px;
    height: calc(100vh - 50px);
    background-color: var(--tertiary-color);
    color: var(--text-secondary-color);
    overflow-y: auto;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    padding-left: 10px;
}

.btn-sidebar {
    display: block;
    padding: 10px;
    color: var(--text-secondary-color);
    text-decoration: none;
    transition: background-color 0.3s;
}

.btn-sidebar:hover {
    background-color: #555;
}
</style>
