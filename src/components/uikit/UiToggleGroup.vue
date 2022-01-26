<template>
    <div
        class="pf-c-toggle-group"
        :class="{
            'pf-m-compact': isCompact,
        }"
    >
        <div
            v-if="$slots.before"
            class="pf-c-toggle-group__item"
        >
            <slot name="before" />
        </div>
        <div
            v-for="item in props.items"
            :key="item.key"
            class="pf-c-toggle-group__item"
        >
            <button
                class="pf-c-toggle-group__button"
                :class="{
                    'pf-m-selected': item.selected,
                }"
                type="button"
                :disabled="item.disabled"
                @click="select(item)"
            >
                <span
                    v-if="item.iconBefore"
                    class="pf-c-toggle-group__icon"
                >
                    <UiIcon :icon="item.iconAfter" />
                </span>
                <span class="pf-c-toggle-group__text">{{ item.nameDisplay }}</span>
                <span
                    v-if="item.iconAfter"
                    class="pf-c-toggle-group__icon"
                >
                    <UiIcon :icon="item.iconAfter" />
                </span>
            </button>
        </div>
        <div
            v-if="$slots.after"
            class="pf-c-toggle-group__item"
        >
            <slot name="after" />
        </div>
    </div>
</template>

<script lang="ts" setup>
export interface UiToggleGroupItem {
    key: string | number;
    nameDisplay: string;
    value: string | number;
    selected?: boolean;
    disabled?: boolean;
    iconBefore?: boolean;
    iconAfter?: string;
}

export interface Props {
    items: UiToggleGroupItem[];
    isCompact?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    isCompact: false,
});

const emit = defineEmits<{
    (e: "select", item: UiToggleGroupItem): void;
}>();

const select = (item: UiToggleGroupItem) => {
    emit('select', item);
}
</script>

<style lang="scss" scoped>
.multi-select-list-item {
    &__input {
        pointer-events: none;
    }
}
</style>