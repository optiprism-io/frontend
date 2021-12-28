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
                        <div class="pf-c-card__body pf-u-color-200">
                            <div class="pf-u-mb-md pf-u-font-size-2xl pf-u-icon-color-light">
                                <UiIcon icon="fas fa-info-circle" />
                            </div>
                            <div class="pf-u-font-size-lg">
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
import { computed, ref, useSlots } from "vue";
import Popper from "vue3-popper";
import SelectList from "@/components/Select/SelectList.vue";
import UiSpinner from "@/components/uikit/UiSpinner.vue";
import UiIcon from "@/components/uikit/UiIcon.vue";
import { Group, Item } from "@/components/Select/SelectTypes";

const slots = useSlots();

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

const selectedItemLocal = ref(false);
const selectedItem = computed(() => {
    return selectedItemLocal.value || props.selected;
});

const select = (item: any, close: () => void): void => {
    close();
    key.value++;
    emit("select", item);
};

const hover = (item: Item): void => {
    if (item) {
        selectedItemLocal.value = item.item;
        emit("onHover", item);
    }
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
        min-width: 20rem;
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
    }
}
</style>
