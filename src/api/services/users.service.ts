import {
    UsersApi,
    CreateUserRequest,
    UpdateUserRequest,
} from '@/api'
import {config} from '@/api/services/config';

const api = new UsersApi(config);

const schemaReports = {
    usersList: async(organizationId: number, projectId: number) => await api.usersList(organizationId, projectId),
    getUser: async(organizationId: number, projectId: number, userId: number) => await api.getUser(organizationId, projectId, userId),
    createUser: async(organizationId: number, projectId: number, payload: CreateUserRequest) => await api.createUser(organizationId, projectId, payload),
    deleteUser: async(organizationId: number, projectId: number, userId: number) => await api.deleteUser(organizationId, projectId, userId),
    updateUser: async(organizationId: number, projectId: number, userId: number, payload: UpdateUserRequest) => await api.updateUser(organizationId, projectId, userId, payload),
}

export default schemaReports
