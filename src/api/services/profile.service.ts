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
    updateEmail: async(updateProfileEmailRequest: UpdateProfileEmailRequest) => await api.updateProfileName_1(updateProfileEmailRequest),
    updatePassword: async(updateProfilePasswordRequest: UpdateProfilePasswordRequest) => await api.updateProfileName_2(updateProfilePasswordRequest),
}

export default schemaProfile
 