<template>
    <div class="home">
        <Header :linkHome="linkHome" :title="pageTitle" />
        <Sidebar :links="sidebarLinks" />
        <router-view>
            <div class="content">
                <Graph />
            </div>
        </router-view>
    </div>
</template>

<script>
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';
import Graph from './Graph.vue';

export default {
    name: 'Home',
    components: {
        Header,
        Sidebar,
        Graph,
    },
    data() {
        return {
            pageTitle: 'Header',
            linkHome: "/",
            sidebarLinks: [
                { text: 'gus', url: '/gus' },
                { text: 'itpt', url: '/itpt' },
                { text: 'loff', url: '/loff' },
                { text: 'des', url: 'des' },
                { text: 'pf', url: '/pf' },
                { text: 'micap', url: '/micap' },
                { text: 'apj', url: '/apj' },
            ],
        }
    },
}
</script>

<style scoped>
.home {
    display: flex;
}

.content {
    margin-top: 60px;
    margin-left: 160px;
    width: calc(100% - 160px);
    height: calc(100vh - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
}
</style>