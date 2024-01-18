import {
    EventRecordsListRequest,
    FunnelQuery,
    QueryApi,
    EventRecordsApi,
} from '@/api'
import {config} from '@/api/services/config';

const queryApi = new QueryApi(config)
const eventRecordsApi = new EventRecordsApi(config)

const dataService = {
    createEventsStream: async(projectId: number, eventListRequest: EventRecordsListRequest) => await eventRecordsApi.eventRecordsList(projectId, eventListRequest),
    funnelQuery: async (projectId: number, query: FunnelQuery) => await queryApi.funnelQuery(projectId, query)
}

export default dataService
