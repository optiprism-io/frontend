<template>
  <form class="pf-u-w-50 pf-c-form pf-u-mb-auto">
    <UiLabelAndSlot :label="t('project.name')">
      <UiInlineEditSlot
        :is-editable="curIsEdit.name"
        :placeholder="name"
        @update:is-editable="editNameHandler"
        @cancel="cancelNameHandler"
        @save="saveProjectNameHandler"
      >
        <UiInput
          v-model="name"
          :invalid="!!errors.updateProject.name?.message"
          @input="emit('input-name')"
          @keyup.enter="saveProjectNameHandler"
        />
      </UiInlineEditSlot>
      <UiFormError :error="errors.updateProject.name?.message" />
    </UiLabelAndSlot>

    <UiLabelAndSlot
      :label="t('project.sessionDuration')"
      :hide-label="isEdit.sessionDurationSeconds"
    >
      <UiInlineEditSlot
        :is-editable="curIsEdit.sessionDurationSeconds"
        :placeholder="`${sessionTimeout} ${sessionPeriod}`"
        @update:is-editable="editDurationHandler"
        @cancel="cancelDurationHandler"
        @save="saveSessionDurationHandler"
      >
        <UiLabelAndSlot :label="t('project.sessionDuration')">
          <div class="pf-l-flex">
            <UiInput
              v-model.number="sessionTimeout"
              class="pf-u-w-initial"
              type="number"
              :min="1"
              :invalid="!!errors.updateProject.sessionDurationSeconds?.message"
              @input="emit('input-duration')"
              @keyup.enter="saveSessionDurationHandler"
            />
            <UiSelect
              class="pf-u-w-initial"
              :items="sessionPeriodOptions"
              :text-button="sessionPeriod"
              @on-select="selectPeriod"
            />
          </div>
        </UiLabelAndSlot>
        <UiFormError :error="errors.updateProject.sessionDurationSeconds?.message" />
      </UiInlineEditSlot>
    </UiLabelAndSlot>
    <UiLabelAndSlot :label="t('project.sdkToken')">
      {{ sdkToken }}
    </UiLabelAndSlot>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { useVModel } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { useI18n } from 'vue-i18n'

import UiFormError from '@/components/uikit/UiFormError.vue'
import UiInlineEditSlot from '@/components/uikit/UiInlineEditSlot.vue'
import UiInput from '@/components/uikit/UiInput.vue'
import UiLabelAndSlot from '@/components/uikit/UiLabelAndSlot.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'

import {
  fromSessionTimeout,
  sessionPeriodOptions,
  toSessionTimeout,
} from '@/components/projects/helpers'

import type {
  Period} from '@/components/projects/helpers';
import type { ProjectEdit, ProjectErrors } from '@/stores/projects/types'

interface IProps {
  name?: string
  sessionDurationSeconds?: number
  sdkToken?: string
  errors: ProjectErrors
  isEdit: ProjectEdit
}

const props = withDefaults(defineProps<IProps>(), {
  name: '',
  sessionDurationSeconds: 0,
  sdkToken: '',
})

const emit = defineEmits<{
  (e: 'save-project-name', value: string): void
  (e: 'save-session-duration', value: number): void
  (e: 'input-name'): void
  (e: 'input-duration'): void
  (e: 'update:isEdit', value: (typeof props)['isEdit']): void
}>()

const { t } = useI18n()

const curIsEdit = useVModel(props, 'isEdit', emit)

const name = ref(props.name)

const [timeout, period] = fromSessionTimeout(props.sessionDurationSeconds)
const sessionTimeout = ref(timeout)
const sessionPeriod = ref(period)

function saveSessionDurationHandler() {
  const sessionDurationSeconds = toSessionTimeout([sessionTimeout.value, sessionPeriod.value])
  emit('save-session-duration', sessionDurationSeconds)
}

function saveProjectNameHandler() {
  emit('save-project-name', name.value)
}

function editNameHandler(val: boolean) {
  const copyIsEdit = cloneDeep(curIsEdit.value)
  copyIsEdit.name = val
  curIsEdit.value = copyIsEdit
}

function editDurationHandler(val: boolean) {
  const copyIsEdit = cloneDeep(curIsEdit.value)
  copyIsEdit.sessionDurationSeconds = val
  curIsEdit.value = copyIsEdit
}

function cancelNameHandler() {
  editNameHandler(false)
  emit('input-name')
}

function cancelDurationHandler() {
  editDurationHandler(false)
  emit('input-duration')
}

function selectPeriod(period: Period) {
  sessionPeriod.value = period
}

watch(
  () => props.isEdit.name,
  () => {
    name.value = props.name
  }
)

watch(
  () => props.isEdit.sessionDurationSeconds,
  () => {
    const [timeout, period] = fromSessionTimeout(props.sessionDurationSeconds)
    sessionTimeout.value = timeout
    sessionPeriod.value = period
  }
)
</script>
