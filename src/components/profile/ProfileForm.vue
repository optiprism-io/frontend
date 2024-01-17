<template>
    <form class="pf-u-w-50 pf-c-form pf-u-mb-auto">
        <UiLabelAndSlot label="Name">
            <UiInlineEditSlot
                :is-editable="curIsEdit.name"
                :placeholder="name"
                @update:is-editable="editNameHandler"
                @cancel="cancelNameHandler"
                @save="saveNameHandler"
            >
                <UiInput
                    v-model="name"
                    :invalid="!!errors.updateName.name?.message"
                    @input="emit('input-name')"
                    @keyup.enter="saveNameHandler"
                />
            </UiInlineEditSlot>
            <UiFormError :error="errors.updateName.name?.message" />
        </UiLabelAndSlot>

        <UiLabelAndSlot
            :label="t('profile.email')"
            :hide-label="isEdit.email"
        >
            <UiInlineEditSlot
                :is-editable="curIsEdit.email"
                :placeholder="email"
                @update:is-editable="editEmailHandler"
                @cancel="cancelEmailHandler"
                @save="saveEmailHandler"
            >
                <div class="pf-l-flex">
                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.email')">
                            <UiInput
                                v-model="email"
                                type="email"
                                :invalid="!!errors.updateEmail.email?.message"
                                @input="emit('input-email')"
                                @keyup.enter="saveEmailHandler"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="errors.updateEmail.email?.message" />
                    </div>

                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.curPassword')">
                            <UiInput
                                v-model="curPasswordForEmail"
                                type="password"
                                :invalid="!!errors.updateEmail.password?.message"
                                @input="emit('input-pass-email')"
                                @keyup.enter="saveEmailHandler"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="errors.updateEmail.password?.message" />
                    </div>
                </div>
            </UiInlineEditSlot>
        </UiLabelAndSlot>

        <UiLabelAndSlot
            :label="t('profile.password')"
            :hide-label="isEdit.password"
        >
            <UiInlineEditSlot
                :is-editable="curIsEdit.password"
                placeholder="********"
                @update:is-editable="editPassHandler"
                @cancel="cancelPasswordHandler"
                @save="savePassHandler"
            >
                <div class="pf-l-flex">
                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.curPassword')">
                            <UiInput
                                v-model="curPassword"
                                type="password"
                                :invalid="!!errors.updatePassword.password?.message"
                                @input="emit('input-pass')"
                                @keyup.enter="savePassHandler"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="errors.updatePassword.password?.message" />
                    </div>
                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.newPassword')">
                            <UiInput
                                v-model="newPassword"
                                type="password"
                                :invalid="!!errors.updatePassword.newPassword?.message"
                                @input="emit('input-pass-confirm')"
                                @keyup.enter="savePassHandler"
                            />
                        </UiLabelAndSlot>
                        <UiFormError :error="errors.updatePassword.newPassword?.message" />
                    </div>
                    <div class="pf-m-flex-1">
                        <UiLabelAndSlot :label="t('profile.confirmPassword')">
                            <UiInput
                                v-model="confirmPassword"
                                type="password"
                                :invalid="!!errors.updatePassword.confirmPassword?.message"
                                @input="emit('input-pass-confirm')"
                                @keyup.enter="savePassHandler"
                            />
                        </UiLabelAndSlot>
                        <UiFormError
                            :error="errors.updatePassword.confirmPassword?.message"
                        />
                    </div>
                </div>
            </UiInlineEditSlot>
        </UiLabelAndSlot>
    </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import UiFormError from '@/components/uikit/UiFormError.vue';
import UiInlineEditSlot from '@/components/uikit/UiInlineEditSlot.vue';
import UiInput from '@/components/uikit/UiInput.vue';
import UiLabelAndSlot from '@/components/uikit/UiLabelAndSlot.vue';

import usei18n from '@/hooks/useI18n';

import { UpdateProfileEmailRequest, UpdateProfileNameRequest } from '@/api';
import { useVModel } from '@vueuse/core';
import { cloneDeep } from 'lodash';
import {
    ProfileEdit,
    ProfileErrors,
    UpdateProfilePasswordRequestExt,
} from '@/stores/profile/types';

const { t } = usei18n();

interface IProps {
  name?: string;
  email?: string;
  errors: ProfileErrors;
  isEdit: ProfileEdit;
}

const props = withDefaults(defineProps<IProps>(), {
    name: '',
    email: '',
});

const emit = defineEmits<{
  (e: 'save-name', value: UpdateProfileNameRequest): void;
  (e: 'save-email', value: UpdateProfileEmailRequest): void;
  (e: 'save-password', value: UpdateProfilePasswordRequestExt): void;
  (e: 'input-name'): void;
  (e: 'input-email'): void;
  (e: 'input-pass-email'): void;
  (e: 'input-pass'): void;
  (e: 'input-pass-confirm'): void;
  (e: 'update:isEdit', value: (typeof props)['isEdit']): void;
}>();

const curIsEdit = useVModel(props, 'isEdit', emit);

const name = ref(props.name);

const email = ref(props.email);
const curPasswordForEmail = ref('');

const curPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

function saveNameHandler() {
    emit('save-name', { name: name.value });
}

function saveEmailHandler() {
    emit('save-email', {
        email: email.value,
        password: curPasswordForEmail.value,
    });
}

function savePassHandler() {
    emit('save-password', {
        password: curPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
    });
}

function editNameHandler(val: boolean) {
    const copyIsEdit = cloneDeep(curIsEdit.value);
    copyIsEdit.name = val;
    curIsEdit.value = copyIsEdit;
}

function editEmailHandler(val: boolean) {
    const copyIsEdit = cloneDeep(curIsEdit.value);
    copyIsEdit.email = val;
    curIsEdit.value = copyIsEdit;
}

function editPassHandler(val: boolean) {
    const copyIsEdit = cloneDeep(curIsEdit.value);
    copyIsEdit.password = val;
    curIsEdit.value = copyIsEdit;
}

function cancelNameHandler() {
    editNameHandler(false);
    emit('input-name');
}

function cancelEmailHandler() {
    editEmailHandler(false);
    emit('input-email');
    emit('input-pass-email');
}

function cancelPasswordHandler() {
    editPassHandler(false);
    emit('input-pass');
    emit('input-pass-confirm');
}

watch(
    () => props.isEdit.name,
    () => {
        name.value = props.name;
    }
);

watch(
    () => props.isEdit.email,
    () => {
        email.value = props.email;
        curPasswordForEmail.value = '';
    }
);

watch(
    () => props.isEdit.password,
    () => {
        curPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
    }
);
</script>
