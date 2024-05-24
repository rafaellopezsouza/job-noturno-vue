import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../components/pages/Home.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*',
        name: 'CatchAll',
        component: Home,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
