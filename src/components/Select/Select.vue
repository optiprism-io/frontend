<template>
    <Popper :key="key" ref="popper" placement="bottom-start">
        <slot></slot>
        <template #content="{ close }">
            <div class="select pf-c-card pf-m-display-lg pf-u-min-width">
                <div v-if="loading" class="select__loader-wrap">
                    <UiSpinner class="select__loader" />
                </div>
                <div
                    v-else
                    class="pf-l-grid"
                    :class="{
                        'pf-m-all-12-col': !slots.description,
                        'pf-m-all-6-col': slots.description
                    }"
                >
                    <div class="pf-l-grid__item select__box">
                        <SelectList
                            :items="items"
                            :grouped="grouped"
                            :selected="selectedItem"
                            @select="select($event, close)"
                            @hover="hover"
                            @on-search="onSearch"
                        />
                    </div>
                    <div
                        v-if="slots.description"
                        class="pf-l-grid__items select__box select__description"
                    >
                        <div class="pf-c-card__body">
                            <div class="select__description-icon">
                                <UiIcon icon="fas fa-info-circle" />
                            </div>
                            <div class="select__description-text">
                                <slot name="description"></slot>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </Popper>
</template>

<script setup lang="ts">
import { ref, useSlots } from "vue";
import Popper from "vue3-popper";
import SelectList from "./SelectList.vue";
import UiSpinner from "../uikit/UiSpinner.vue";
import UiIcon from "@/components/uikit/UiIcon.vue";

const slots = useSlots();

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
    (e: "onSearch", payload: string): void;
    (e: "onHover", item: any): void;
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
    emit("onHover", item);
};

const onSearch = (payload: string) => {
    emit("onSearch", payload);
};
</script>

<style scoped lang="scss">
.select {
    position: relative;

    &__box {
        width: 20rem;
    }

    &__loader-wrap {
        width: 40rem;
        min-height: 18rem;
    }

    &__loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &__description {
        border-left: 1px solid #d2d2d2;
        color: var(--pf-global--palette--black-600);
    }

    &__description-icon {
        margin-bottom: 1rem;
        font-size: var(--pf-global--FontSize--2xl);
    }

    &__description-text {
        font-size: var(--pf-global--FontSize--lg);
    }
}
</style>
