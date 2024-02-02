<template>
    <div
        class="pf-c-tabs pf-u-w-initial"
        :class="{
            'pf-m-box': props.box,
            'pf-m-vertical': props.isVertical,
            'pf-u-flex-direction-row': props.isVertical
        }"
    >
        <ul class="pf-c-tabs__list">
            <li
                v-for="item in props.items"
                :key="item.name"
                class="pf-c-tabs__item"
                v-tooltip="item.tooltip"
                :class="{
                    'pf-m-current': item.active,
                }"
            >
                <component
                    :is="item.link ? 'router-link' : 'button'"
                    class="pf-c-tabs__link"
                    :to="item.link"
                    :disabled="item.disabled"
                    @click="onSelect(item.value)"
                >
                    <span
                        v-if="item.icon"
                        class="pf-c-tabs__item-icon"
                        aria-hidden="true"
                    >
                        <UiIcon
                            v-if="item.icon"
                            :icon="item.icon"
                        />
                    </span>
                    <span
                        class="pf-c-tabs__item-text"
                    >
                        {{ item.name }}
                    </span>
                </component>
            </li>
        </ul>
        <slot name="afterTabs" />
    </div>
</template>

<script lang="ts" setup>
type Item = {
    name: string,
    value: string,
    icon?: string,
    active?: boolean,
    link?: any,
    disabled?: boolean,
    tooltip?: string,
}

interface Props {
    items: Item[],
    box?: boolean,
    isVertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
    (e: 'on-select', payload: string): void;
}>();

const onSelect = (value: string) => {
    emit('on-select', value);
};
</script>

<style lang="scss" scoped></style>