import {
    ProfileApi,
    UpdateProfileEmailRequest,
    UpdateProfileNameRequest,
    UpdateProfilePasswordRequest,
} from '@/api';
import { config } from '@/api/services/config';

const api = new ProfileApi(config);

const schemaProfile = {
    getProfile: async() => await api.getProfile(),
    updateName: async(updateProfileNameRequest: UpdateProfileNameRequest) => await api.updateProfileName(updateProfileNameRequest),
    updateEmail: async(updateProfileEmailRequest: UpdateProfileEmailRequest) => await api.updateProfileEmail(updateProfileEmailRequest),
    updatePassword: async(updateProfilePasswordRequest: UpdateProfilePasswordRequest) => await api.updateProfilePassword(updateProfilePasswordRequest),
}

export default schemaProfile
 