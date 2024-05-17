<template>
    <div class="sidebar">
        <ul>
            <li v-for="(link, index) in links" :key="index">
                <router-link :to="link.url" class="link-sidebar">
                    <Button class="btn-sidebar" :label="link.text.toUpperCase()" outlined />
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import Button from 'primevue/button';

export default {
    name: 'Sidebar',
    components: {
        Button
    },
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

.link-sidebar {
    display: block;
    text-decoration: none;
    transition: background-color 0.3s;
}

.btn-sidebar {
    color: var(--text-secondary-color);
    padding: 10px;
    border: none;
}

.link-sidebar:hover {
    background-color: #555;
}
</style>
