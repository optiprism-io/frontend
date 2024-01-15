import { defineStore } from 'pinia';
import {
    Profile,
    UpdateProfileEmailRequest,
    UpdateProfileNameRequest,
    UpdateProfilePasswordRequest,
} from '@/api';
import profileService from '@/api/services/profile.service';
import { useAuthStore } from '@/stores/auth/auth';

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
                await profileService.updateName({ name });
                this.profile = {
                    ...this.profile,
                    name,
                };
            } catch (error) {
                /* TODO: add handle errors from server */
                throw new Error('error update name');
            }
        },

        async updateEmail({ email, password }: UpdateProfileEmailRequest) {
            const authStore = useAuthStore();

            try {
                const { data } = await profileService.updateEmail({
                    email,
                    password,
                });
                this.profile = {
                    ...this.profile,
                    email,
                };
                authStore.setToken(data);
            } catch (error) {
                /* TODO: add handle errors from server */
                throw new Error('error update email');
            }
        },

        async updatePassword({
            password,
            newPassword,
        }: UpdateProfilePasswordRequest) {
            const authStore = useAuthStore();

            try {
                const { data } = await profileService.updatePassword({
                    password,
                    newPassword,
                });
                authStore.setToken(data);
            } catch (error) {
                /* TODO: add handle errors from server */
                throw new Error('error update email');
            }
        },
    },
});
