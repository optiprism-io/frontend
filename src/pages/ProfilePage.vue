<template>
    <div class="pf-c-page__main-section pf-u-p-md pf-u-pb-3xl">
        <ToolsLayout>
            <template #title>
                {{ $t("profile.title") }}
            </template>
            <template #main>
                <UiCard class="pf-c-card pf-m-compact pf-u-h-100">
                    <UiSpinner
                        v-if="isLoading"
                        class="pf-u-display-flex pf-u-m-auto"
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
                </UiCard>
            </template>
        </ToolsLayout>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import ProfileForm from '@/components/profile/ProfileForm.vue';
import UiSpinner from '@/components/uikit/UiSpinner.vue';
import UiCard from '@/components/uikit/UiCard/UiCard.vue';
import ToolsLayout from '@/layout/tools/ToolsLayout.vue';

import { useProfileStore } from '@/stores/profile';

const profileStore = useProfileStore();
const { getProfile, updateName, updateEmail, updatePassword } = profileStore;
const { profile, isLoading } = storeToRefs(profileStore);

getProfile();
</script>