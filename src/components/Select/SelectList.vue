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
      <template v-if="grouped">
        <template v-for="(group,index) in items">
          <template v-if="group.name">
            <section class="pf-c-menu__group">
              <hr class="pf-c-divider" v-if="index>0"/>
              <h1 class="pf-c-menu__group-title">{{ group.name }}</h1>
              <ul class="pf-c-menu__list">
                <SelectListItem v-for="item in group.items"
                                :item="item.item"
                                :text="item.name"
                                :multi="multi"
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
                              :item="item.item"
                              :text="item.name"
                              :multi="multi"
                              :selected="selected"
                              @hover="hover"
                              @click="select"

              ></SelectListItem>
            </ul>
          </template>
        </template>
      </template>
      <template v-else>
        <ul class="pf-c-menu__list">
          <SelectListItem v-for="item in items"
                          :item="item.item"
                          :text="item.name"
                          :multi="multi"
                          :selected="selected"
                          @hover="hover"
                          @click="select"

          ></SelectListItem>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Group, Item} from "./Select.vue";
import SelectListItem from "./SelectListItem.vue"
import {ref} from "vue";

const props = defineProps<{
  items: Item[] | Group[];
  grouped: boolean;
  multi: boolean;
  selected?: any;
}>()

const emit = defineEmits<{
  (e: 'select', item: any): void
  (e: 'hover', item: any): void
}>()


const hover = (item: any): void => {
  emit('hover', item);
}

const select = (item: any): void => {
  emit('select', item);
}
</script>