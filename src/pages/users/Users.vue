<template>
  <section>
    <UiTabs
      class="pf-u-mb-md"
      :items="items"
    >
      <template
        #after
      >
        <UiSelect
          v-if="selectedGroup?.name"
          class="pf-u-ml-lg"
          :items="selectGroups"
          :width-auto="true"
          :selections="[selectedGroup.id]"
          @on-select="onSelectGroup"
        >
          <template #action>
            <UiButton
              :is-link="true"
              :after-icon="'fas fa-chevron-down'"
            >
              {{ selectedGroupByString }}
            </UiButton>
          </template>
        </UiSelect>
      </template>
    </UiTabs>
    <RouterView />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'
import { useRoute, RouterView } from 'vue-router'

import UiButton from '@/components/uikit/UiButton.vue'
import UiSelect from '@/components/uikit/UiSelect.vue'
import UiTabs from '@/components/uikit/UiTabs.vue'

import { useGroup } from '@/hooks/useGroup'
import { pagesMap } from '@/router'
import { useGroupStore } from '@/stores/group/group'
import { useLexiconStore } from '@/stores/lexicon'

const { t } = useI18n()
const route = useRoute()
const lexiconStore = useLexiconStore()
const { selectGroups } = useGroup()
const groupStore = useGroupStore()

const strings = computed(() => {
  return {
    usersTitle: t('users.users.title'),
    usersProperties: t('users.users.properties'),
  }
})

const selectedGroup = computed(() => lexiconStore.groups.find(item => item.id === groupStore.group))
const selectedGroupByString = computed(() => `${t('common.group', { name: selectedGroup.value?.name })}`)

const items = computed(() => [
  {
    name: strings.value.usersTitle,
    value: pagesMap.usersGroupRecords,
    link: {
      name: pagesMap.usersGroupRecords,
    },
    active: route.name === pagesMap.usersGroupRecords,
  },
  {
    name: strings.value.usersProperties,
    value: pagesMap.usersProperties,
    link: {
      name: pagesMap.usersProperties,
    },
    active: route.name === pagesMap.usersProperties,
  },
])

const onSelectGroup = (value: number) => {
  groupStore.group = value
  groupStore.getList()
}
</script>

<style scoped lang="scss"></style>
