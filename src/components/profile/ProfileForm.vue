<template>
    <form class="pf-u-w-50 pf-c-form pf-u-mb-auto">
        <UiLabelAndSlot label="Name">
            <UiInlineEditSlot
                v-model:is-editable="isEditableName"
                :placeholder="name"
                @cancel="cancelEditName"
                @save="saveEditName"
            >
                <UiInput
                    v-model="name"
                    :invalid="!!nameError"
                    @input="clearNameError"
                />
            </UiInlineEditSlot>
            <UiFormError :error="nameError?.message" />
        </UiLabelAndSlot>

        <UiLabelAndSlot
            :label="t('profile.email')"
            :hide-label="isEditableEmail"
        >
            <UiInlineEditSlot
                v-model:is-editable="isEditableEmail"
                :placeholder="email"
                @cancel="cancelEditEmail"
                @save="saveEditEmail"
            >
                <div class="pf-l-flex">
                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.email')">
                            <UiInput
                                v-model="email"
                                type="email"
                                :invalid="!!emailError"
                                @input="clearEmailError"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="emailError?.message" />
                    </div>

                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.curPassword')">
                            <UiInput
                                v-model="curPasswordForEmail"
                                type="password"
                                :invalid="!!curPasswordForEmailError"
                                @input="clearCurPasswordForEmailError"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="curPasswordForEmailError?.message" />
                    </div>
                </div>
            </UiInlineEditSlot>
        </UiLabelAndSlot>

        <UiLabelAndSlot
            :label="t('profile.password')"
            :hide-label="isEditablePassword"
        >
            <UiInlineEditSlot
                v-model:is-editable="isEditablePassword"
                placeholder="********"
                @cancel="resetEditPassword"
                @save="saveEditPassword"
            >
                <div class="pf-l-flex">
                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.curPassword')">
                            <UiInput
                                v-model="curPassword"
                                type="password"
                                :invalid="!!curPasswordError"
                                @input="clearCurPasswordError"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="curPasswordError?.message" />
                    </div>
                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.newPassword')">
                            <UiInput
                                v-model="newPassword"
                                type="password"
                                :invalid="!!newPasswordError"
                                @input="clearNewAndConfirmPasswordError"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="newPasswordError?.message" />
                    </div>
                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.confirmPassword')">
                            <UiInput
                                v-model="confirmPassword"
                                type="password"
                                :invalid="!!confirmPasswordError"
                                @input="clearNewAndConfirmPasswordError"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="confirmPasswordError?.message" />
                    </div>
                </div>
            </UiInlineEditSlot>
        </UiLabelAndSlot>
    </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { safeParse, type ValiError } from 'valibot';

import UiInlineEditSlot from '@/components/uikit/UiInlineEditSlot.vue';
import UiInput from '@/components/uikit/UiInput.vue';
import UiLabelAndSlot from '@/components/uikit/UiLabelAndSlot.vue';

import usei18n from '@/hooks/useI18n';

import UiFormError from '@/components/uikit/UiFormError.vue';
import {
    confirmPasswordScheme,
    notEmptyEmailScheme,
    notEmptyStringScheme,
} from '@/components/profile/validationSchemes';

const { t } = usei18n();

interface IProps {
  name?: string;
  email?: string;
}

const props = withDefaults(defineProps<IProps>(), {
    name: '',
    email: '',
});

const emit = defineEmits(['update-name', 'update-email', 'update-password']);

const name = ref(props.name);
const isEditableName = ref(false);
const nameError = ref<ValiError | undefined>();

const email = ref(props.email);
const curPasswordForEmail = ref('');
const isEditableEmail = ref(false);
const emailError = ref<ValiError | undefined>();
const curPasswordForEmailError = ref<ValiError | undefined>();

const curPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isEditablePassword = ref(false);
const curPasswordError = ref<ValiError | undefined>();
const newPasswordError = ref<ValiError | undefined>();
const confirmPasswordError = ref<ValiError | undefined>();

function resetEditName() {
    isEditableName.value = false;
    clearNameError();
}

function resetEditEmail() {
    curPasswordForEmail.value = '';
    isEditableEmail.value = false;
    clearEmailError();
    clearCurPasswordForEmailError();
}

function resetEditPassword() {
    curPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    isEditablePassword.value = false;
    clearCurPasswordError();
    clearNewAndConfirmPasswordError();
}

function cancelEditName() {
    name.value = props.name;
    resetEditName();
}

function cancelEditEmail() {
    email.value = props.email;
    resetEditEmail();
}

function saveEditName() {
    const nCheck = safeParse(notEmptyStringScheme, name.value);
    if (!nCheck.success) {
        nameError.value = nCheck.error;
        return;
    }
    emit('update-name', { name: name.value });
    resetEditName();
}

function saveEditEmail() {
    const eCheck = safeParse(notEmptyEmailScheme, email.value);
    const pCheck = safeParse(notEmptyStringScheme, curPasswordForEmail.value);
    if (!eCheck.success || !pCheck.success) {
        emailError.value = eCheck.error;
        curPasswordForEmailError.value = pCheck.error;
        return;
    }
    emit('update-email', { email: email.value });
    resetEditEmail();
}

function saveEditPassword() {
    const curPCheck = safeParse(notEmptyStringScheme, curPassword.value);
    const newPCheck = safeParse(notEmptyStringScheme, newPassword.value);
    const conPCheck = safeParse(confirmPasswordScheme, {
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
    });

    if (!curPCheck.success || !newPCheck.success || !conPCheck.success) {
        curPasswordError.value = curPCheck.error;
        newPasswordError.value = newPCheck.error;
        confirmPasswordError.value = conPCheck.error;
        return;
    }

    emit('update-password', {
        password: curPassword.value,
        newPassword: newPassword.value,
    });
    resetEditPassword();
}

function clearNameError() {
    nameError.value = undefined;
}

function clearEmailError() {
    emailError.value = undefined;
}

function clearCurPasswordForEmailError() {
    curPasswordForEmailError.value = undefined;
}

function clearCurPasswordError() {
    curPasswordError.value = undefined;
}

function clearNewAndConfirmPasswordError() {
    newPasswordError.value = undefined;
    confirmPasswordError.value = undefined;
}
</script>
