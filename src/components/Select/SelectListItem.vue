<template>
    <li
        class="pf-c-menu__list-item"
        :class="isSelected && 'pf-c-menu__list-item--selected'"
    >
        <div
            class="pf-c-menu__item"
            @click="$emit('click', item)"
        >
            <span class="pf-c-menu__item-main">
                <span class="pf-c-menu__item-text">{{ text }}</span>
            </span>
        </div>
    </li>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
    item: any;
    selected?: any;
    text: string;
}>();

defineEmits<{
    (e: "click", item: any): void;
}>();

const isSelected = computed(() => {
    if (!props.selected) {
        return false;
    }

    return JSON.stringify(props.item) === JSON.stringify(props.selected);
});
</script>

<style scoped lang="scss">
.pf-c-menu__list-item--selected {
    background-color: var(--pf-c-menu__list-item--hover--BackgroundColor);
}
.pf-c-menu {
    &__list-item {
        cursor: pointer;
    }
}
</style>
