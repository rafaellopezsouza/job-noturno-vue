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
    top: 4rem;
    left: 0;
    width: 10rem;
    height: 100vh;
    background-color: var(--primary-color);
    color: var(--text-secondary-color);
    overflow-y: auto;
}

ul {
    list-style-type: none;
    padding-left: 10px;
}

.btn-sidebar {
    color: var(--text-secondary-color);
    border: none;
    margin-left: 1rem;
}

.link-sidebar {
    display: block;
    transition: background-color 0.3s;
}

.link-sidebar:hover {
    background-color: rgba(255, 255, 255, 0.25);
}
</style>
