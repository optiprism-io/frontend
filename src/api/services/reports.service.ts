import {
    EventSegmentation,
    ReportsApi,
    CreateReportRequest,
    UpdateReportRequest,
    QueryApi,
    EventSegmentationQueryFormatEnum,
} from '@/api'
import { config } from '@/api/services/config';

const api = new ReportsApi(config);
const queryApi = new QueryApi(config);

const schemaReports = {
    eventSegmentation: async(projectId: number, eventSegmentation: EventSegmentation) => await queryApi.eventSegmentationQuery(projectId, EventSegmentationQueryFormatEnum.Json, eventSegmentation),

    reportsList: async(projectId: number) => await api.reportsList(projectId),
    getReport: async(projectId: number, reportId: number) => await api.getReport(projectId, reportId),
    createReport: async(projectId: number, createReportRequest: CreateReportRequest) => await api.createReport(projectId, createReportRequest),
    deleteReport: async(projectId: number, reportId: number) => await api.deleteReport(projectId, reportId),
    updateReport: async(projectId: number, reportId: number, updateReportRequest: UpdateReportRequest) => await api.updateReport(projectId, reportId, updateReportRequest),
}

export default schemaReports
