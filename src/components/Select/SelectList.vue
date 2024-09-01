<template>
  <div class="pf-v5-c-menu pf-v5-m-plain pf-v5-m-scrollable">
    <div
      v-if="showSearch"
      class="pf-v5-c-menu__search"
    >
      <div class="pf-v5-c-menu__search-input">
        <input
          v-model="search"
          class="pf-v5-c-form-control pf-v5-m-search"
          type="search"
          name="search-input"
          aria-label="Search"
          @input="onSearch"
        >
      </div>
    </div>
    <div
      class="pf-v5-c-menu__content"
      :class="{
        'pf-v5-c-select': props.multiple
      }"
    >
      <template v-if="grouped">
        <template
          v-for="(group, index) in groupedItems"
          :key="group.name"
        >
          <template v-if="group.name">
            <section class="pf-v5-c-menu__group">
              <hr
                v-if="index > 0"
                class="pf-v5-c-divider"
              >
              <div class="pf-v5-c-action-list">
                <div class="pf-v5-c-action-list__item">
                  <div class="pf-v5-c-menu__group-title">
                    {{ group.name }}
                  </div>
                </div>
                <div
                  v-if="group.action"
                  class="pf-v5-c-action-list__item pf-v5-u-pt-md"
                >
                  <UiButton
                    class="pf-v5-m-link"
                    :before-icon="group.action.icon"
                    @click="onAction(group.action ? group.action.type : '')"
                  >
                    {{ $t(group.action.text) }}
                  </UiButton>
                </div>
              </div>

              <ul class="pf-v5-c-menu__list">
                <SelectListItem
                  v-for="(item, i) in group.items"
                  :key="i"
                  :item="item.item"
                  :text="item.name"
                  :selected="selected"
                  :is-disabled="item.disabled"
                  :editable="item.editable"
                  :multiple="props.multiple"
                  :active="item.selected"
                  @mouseenter="hover(item)"
                  @click="select"
                  @edit="emit('edit', $event)"
                />
              </ul>
            </section>
          </template>
          <ul
            v-else
            class="pf-v5-c-menu__list"
          >
            <SelectListItem
              v-for="item in group.items"
              :key="item.item?.id || item.item"
              :item="item.item"
              :text="item.name"
              :selected="selected"
              :multiple="props.multiple"
              :active="item.selected"
              :no-selected="item.noSelected"
              @mouseenter="hover(item)"
              @click="select"
            />
          </ul>
        </template>
      </template>
      <template v-else>
        <ul class="pf-v5-c-menu__list">
          <SelectListItem
            v-for="item in itemItems"
            :key="item.item.id"
            :item="item.item"
            :items="item.items || undefined"
            :text="item.name"
            :selected="selected"
            :multiple="props.multiple"
            :active="item.selected"
            @mouseenter="hover(item)"
            @click="select"
          />
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import SelectListItem from '@/components/Select/SelectListItem.vue';
import UiButton from '@/components/uikit/UiButton.vue'

import type { Group, Item } from '@/components/Select/SelectTypes';

const emit = defineEmits<{
    (e: 'select', item: any): void;
    (e: 'hover', item: any): void;
    (e: 'on-search', value: string): void;
    (e: 'action', payload: string): void
    (e: 'edit', payload: number): void
}>();

const props = defineProps<{
    items: Item<any, any>[] | Group<any>[];
    grouped: boolean;
    selected?: any;
    showSearch?: boolean;
    multiple?: boolean
}>();

const search = ref('');

const groupedItems = computed((): Group<any>[] => {
    if (props.grouped) {
        return props.items as Group<any>[];
    } else {
        return [];
    }
});

const itemItems = computed((): Item<any, any>[] => {
    if (props.grouped) {
        return [];
    } else {
        return props.items as Item<any, any>[];
    }
});

const hover = (item: any): void => {
    emit('hover', item);
};

const select = (item: any): void => {
    emit('select', item);
};

const onSearch = (): void => {
    emit('on-search', search.value);
};

const onAction = (payload: string) => {
    emit('action', payload)
}
</script>
