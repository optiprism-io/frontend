<template>
    <Popper :key="key" ref="popper" placement="bottom-start">
        <slot></slot>
        <template #content="{ close }">
            <div
                class="select pf-c-card pf-m-display-lg pf-u-min-width"
                style="--pf-u-min-width--MinWidth: 700px"
            >
                <UiSpinner v-if="loading" class="select__loader" />
                <div v-else class="pf-l-grid pf-m-all-6-col">
                    <div class="pf-l-grid__item select__box">
                        <SelectList
                            :items="items"
                            :grouped="grouped"
                            :selected="selectedItem"
                            @select="select($event, close)"
                            @hover="hover"
                        />
                    </div>
                    <div class="pf-l-grid__items select__description">
                        <div class="pf-c-card__body">df</div>
                    </div>
                </div>
            </div>
        </template>
    </Popper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Popper from "vue3-popper";
import SelectList from "./SelectList.vue";
import UiSpinner from "../uikit/UiSpinner.vue";

export interface Item {
    item: any;
    name: string;
}

export interface Group {
    name: string;
    items: Item[];
}

const emit = defineEmits<{
    (e: "select", item: any): void;
}>();

const props = withDefaults(
    defineProps<{
        items: Item[] | Group[];
        grouped?: boolean;
        selected?: any;
        loading?: boolean;
    }>(),
    {
        grouped: false,
        selected: false
    }
);

let key = ref(0);

// this way we're able te change initially selected item on hover
let selectedItem = ref(props.selected);

const select = (item: any, close: () => void): void => {
    close();
    key.value++;
    emit("select", item);
};

const hover = (item: any): void => {
    selectedItem.value = item;
};
</script>

<style scoped lang="scss">
.select {
    position: relative;
    min-width: 34rem;
    min-height: 16rem;

    &__loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &__description {
        border-left: 1px solid #d2d2d2;
    }
}
</style>
