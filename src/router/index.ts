import { createRouter, createWebHistory } from 'vue-router'

const Index = () => import('@/pages/Index.vue')

const routes = [
    {
        // path: '/',
        path: '/:pathMatch(.*)*', // for all routes
        name: 'index',
        component: Index,
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
