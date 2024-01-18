import {
    DashboardsApi,
    CreateDashboardRequest,
    UpdateDashboardRequest,
} from '@/api'
import {config} from '@/api/services/config';

const api = new DashboardsApi(config)

const schemaDashboards = {
    dashboardsList: async(projectId: number) => await api.dashboardsList(projectId),
    createDashboard: async(projectId: number, params: CreateDashboardRequest) => await api.createDashboard(projectId, params),
    deleteDashboard: async(projectId: number, dashboardId: number) => await api.deleteDashboard(projectId, dashboardId),
    getDashboard: async(projectId: number, dashboardId: number) => await api.getDashboard(projectId, dashboardId),
    updateDashboard: async(projectId: number, dashboardId: number, updateDashboardRequest: UpdateDashboardRequest) => await api.updateDashboard(projectId, dashboardId, updateDashboardRequest),
}

export default schemaDashboards
