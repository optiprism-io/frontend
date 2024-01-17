import {
    GroupRecordsApi,
    GroupRecordsListRequest,
    UpdateGroupRecordRequest,
} from '@/api';
import { config } from '@/api/services/config';

const api = new GroupRecordsApi(config);

export const groupRecordsService = {
    getList: async(projectId: number, groupRecordsListRequest: GroupRecordsListRequest) => await api.groupRecordsList(projectId, groupRecordsListRequest),
    get: async(projectId: number, id: number) => await api.getGroupRecord(projectId, id),
    updated: async(projectId: number, id: number, updateGroupRecordRequest: UpdateGroupRecordRequest) => await api.updateGroupRecord(projectId, id, updateGroupRecordRequest),
};