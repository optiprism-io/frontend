<template>
    <Popper placement="bottom-start" :key="key" ref="popper">
        <slot></slot>
        <template #content="{ close }">
            <div
                class="pf-c-card pf-m-compact pf-u-min-width"
                style="--pf-u-min-width--MinWidth: 350px;"
            >
                <MultiSelectList
                    :items="items"
                    :selected="selected"
                    @select="select"
                    @deselect="deselect"
                />
            </div>
        </template>
    </Popper>
</template>

<script setup lang="ts">
import Popper from 'vue3-popper'
import MultiSelectList from './MultiSelectList.vue'
import { ref } from 'vue'

export interface Item {
    item: any;
    name: string
}

const emit = defineEmits<{
    (e: 'select', item: any): void
    (e: 'deselect', item: any): void
}>()

const props = withDefaults(defineProps<{
    items: Item[];
    selected?: any;
}>(), {
});

let key = ref(0);

const select = (item: any): void => {
    emit('select', item);
}

const deselect = (item: any): void => {
    emit('deselect', item);
}
</script>

<style scoped>
.event-select__description {
    border-left: 1px solid #d2d2d2;
}
</style>
