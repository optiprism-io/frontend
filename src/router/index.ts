import { createRouter, createWebHistory } from "vue-router"

const Index = () => import("@/pages/Index.vue");
const Dashboard = () => import("@/pages/Dashboard.vue");
const Funnels = () => import("@/pages/Funnels.vue");

const routes = [
    {
        path: '/',
        name: 'dashboard.index',
        component: Dashboard,
        children: [
            {
                path: '/',
                name: 'dashboard_events_segmentation',
                component: Index,
            },
            {
                path: '/funnels',
                name: 'dashboard_funnels',
                component: Funnels,
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'index',
        redirect: '/'
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
