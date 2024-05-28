<template>
    <div class="home">
        <Header :linkHome="linkHome" :title="pageTitle" />
        <div class="main-content">
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
</template>

<script>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Header from '../Header.vue';
import Daily from './Daily.vue';
import Monthly from './Monthly.vue';
import Annual from './Annual.vue';
import { data } from '../../assets/dataMock';
import { tabsName } from '../../assets/data';

export default {
    name: 'Home',
    components: {
        Header,
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
            data,
        };
    },
    data() {
        return {
            pageTitle: 'Home',
            linkHome: '/',
        };
    },
};
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    margin-top: 100px;
}

.main-content {
    display: flex;
    flex: 1;
    height: 100%;
    width: 100%;
    margin: 4rem;
    align-items: center;
    justify-content: center;
}
</style>
