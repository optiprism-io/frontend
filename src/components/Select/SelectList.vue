<template>
  <div class="pf-c-menu pf-m-plain pf-m-scrollable">
    <div class="pf-c-menu__search">
      <div class="pf-c-menu__search-input">
        <input
            class="pf-c-form-control pf-m-search"
            type="search"
            id="-search-input"
            name="-search-input"
            aria-label="Search"
        />
      </div>
    </div>
    <div class="pf-c-menu__content">
      <template v-for="(group,index) in groupedItems">
        <template v-if="group.name">
          <section class="pf-c-menu__group">
            <hr class="pf-c-divider" v-if="index>0"/>
            <h1 class="pf-c-menu__group-title">{{ group.name }}</h1>
            <ul class="pf-c-menu__list">
              <SelectListItem v-for="item in group.items"
                              :item="item.item"
                              :text="item.name"
                              :selected="selected"
                              @hover="hover"
                              @click="select"
              ></SelectListItem>
            </ul>
          </section>
        </template>
        <template v-else>
          <ul class="pf-c-menu__list">
            <SelectListItem v-for="item in group.items"
                            :item="item"
                            :text="item.name"
                            :selected="selected"
                            @hover="hover"
                            @click="select"

            ></SelectListItem>
          </ul>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Group} from "./Select.vue";
import SelectListItem from "./SelectListItem.vue"
import {ref} from "vue";

const props = defineProps<{
  groupedItems: Group[];
  selected?: any;
}>()

const emit = defineEmits<{
  (e: 'select', item: any): void
  (e: 'hover', item: any): void
}>()

let selected = ref(props.selected);

const hover = (item: any): void => {
  selected.value = item;
  emit('hover', item);
}

const select = (item: any): void => {
  emit('select', item);
}
</script>