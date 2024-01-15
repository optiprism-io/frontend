import { defineStore } from 'pinia';
import {
    Profile,
    UpdateProfileEmailRequest,
    UpdateProfileNameRequest,
    UpdateProfilePasswordRequest,
} from '@/api';
import profileService from '@/api/services/profile.service';

interface ProfileState {
  profile: {
    id: number | null;
    name: string;
    email: string;
  };
  isLoading: boolean;
}

interface ProfileResponse {
  data: Profile;
}

export const useProfileStore = defineStore('profile', {
    state: (): ProfileState => ({
        profile: {
            id: null,
            name: '',
            email: '',
        },
        isLoading: false,
    }),
    
    actions: {
        async getProfile() {
            this.isLoading = true;
            try {
                const { data } = await profileService.getProfile();
                this.profile = data;
            } catch (error) {
                /* TODO: add handle errors from server */
                throw new Error('error get profile');
            } finally {
                this.isLoading = false;
            }
        },

        async updateName({ name }: UpdateProfileNameRequest) {
            try {
                const { data } = await profileService.updateName({ name });
                this.profile = data;
            } catch (error) {
                /* TODO: add handle errors from server */
                throw new Error('error update name');
            }
        },

        async updateEmail({ email, password }: UpdateProfileEmailRequest) {
            try {
                const { data } = await profileService.updateEmail({
                    email,
                    password,
                });
                this.profile = data;
            } catch (error) {
                /* TODO: add handle errors from server */
                throw new Error('error update email');
            }
        },

        async updatePassword({ password, newPassword }: UpdateProfilePasswordRequest) {
            try {
                const { data } = await profileService.updatePassword({ password, newPassword })
                this.profile = data;
            } catch (error) {
                /* TODO: add handle errors from server */
                throw new Error('error update email');
            }
        },
    },
});
