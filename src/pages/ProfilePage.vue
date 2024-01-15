<template>
    <div class="pf-c-page__main-section pf-u-p-md pf-u-pb-3xl">
        <div class="pf-l-bullseye">
            <UiSpinner
                v-if="isLoading"
                :size="'xl'"
            />
            <ProfileForm
                v-else
                :name="profile.name"
                :email="profile.email"
                @update-name="updateName"
                @update-email="updateEmail"
                @update-password="updatePassword"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import ProfileForm from '@/components/profile/ProfileForm.vue';
import UiSpinner from '@/components/uikit/UiSpinner.vue';

import { useProfileStore } from '@/stores/profile';

const profileStore = useProfileStore();
const { getProfile, updateName, updateEmail, updatePassword } = profileStore;
const { profile, isLoading } = storeToRefs(profileStore);

getProfile();
</script>