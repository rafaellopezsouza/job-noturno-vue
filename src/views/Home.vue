<template>
    <div class="home">
        <Header :linkHome="linkHome" :title="pageTitle" />
        <div class="main-content">
            <Sidebar :links="sidebarLinks" />
            <div class="content">
                <div class="graph-view">
                    <h1 class="title">
                        Relatório Execução Job Noturno
                    </h1>
                    <TabView>
                        <TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
                            <div v-if="tab.content === 'daily'">
                                <Daily :path="$route.path" :dataTable="dataTable" />
                            </div>
                            <div v-if="tab.content === 'monthly'">
                                <Monthly :path="$route.path" :dataTable="dataTable" />
                            </div>
                            <div v-if="tab.content === 'annual'">
                                <Annual :path="$route.path" :dataTable="dataTable" />
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue';
import Daily from './Daily.vue';
import Monthly from './Monthly.vue';
import Annual from './Annual.vue';
import { dataTable } from '../assets/dataMock';
import { tabsName } from '../assets/data';

export default {
    name: 'Home',
    components: {
        Header,
        Sidebar,
        TabView,
        TabPanel,
        Daily,
        Monthly,
        Annual,
    },
    setup() {
        const tabs = ref(tabsName);
        return {
            tabs,
            dataTable,
        };
    },
    data() {
        return {
            pageTitle: 'Home',
            linkHome: '/',
            sidebarLinks: [
                { text: 'gus', url: '/gus' },
                { text: 'itpt', url: '/itpt' },
                { text: 'loff', url: '/loff' },
                { text: 'des', url: '/des' },
                { text: 'pf', url: '/pf' },
                { text: 'micap', url: '/micap' },
                { text: 'apj', url: '/apj' },
            ],
        };
    },
};
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    margin-left: 200px;
}

.main-content {
    display: flex;
    flex: 1;
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.title {
    margin-top: 60px;
    color: var(--text-primary-color);
    text-align: center;
}

.graph-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>