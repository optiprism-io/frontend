import { defineStore } from 'pinia';

import { apiClient } from '@/api/apiClient'
import { useProjectsStore } from '@/stores/projects/projects'

import type { Dashboard } from '@/api';

type DashboardsStore = {
    dashboards: Dashboard[],
};

export const useDashboardsStore = defineStore('dashboards', {
    state: (): DashboardsStore => ({
        dashboards: [],
    }),
    actions: {
        async getDashboards() {
            const projectsStore = useProjectsStore()
            try {
                const res =  await apiClient.dashboards.dashboardsList(projectsStore.projectId)
                if (res?.data?.data) {
                    this.dashboards = res.data.data
                }
            } catch (e) {
                console.error('error update event property');
            }
        },
    },
    getters: {},
});
