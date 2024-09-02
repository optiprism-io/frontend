<template>
  <div class="pf-l-flex pf-m-column">
    <FilterGroup
      v-for="(_, index) in groups"
      :key="index"
      :kandex="index"
      :index="index"
      @input="$emit('input')"
    />
    <div
      v-if="filterGroupsStore.isFiltersAdvanced && groups.length === 0"
      class="pf-l-flex"
    >
      <UiButton
        :is-link="true"
        :before-icon="'fas fa-plus'"
        @click="filterGroupsStore.addFilterGroup"
      >
        {{ $t('filters.addGroup') }}
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import FilterGroup from '@/components/funnels/filters/FilterGroup.vue'
import UiButton from '@/components/uikit/UiButton.vue'

import { useFilterGroupsStore } from '@/stores/reports/filters'

defineEmits<{
  (e: 'input'): void
}>()

const filterGroupsStore = useFilterGroupsStore()

const groups = computed(() => filterGroupsStore.filterGroups)
</script>
