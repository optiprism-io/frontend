<template>
    <ul class="ui-tabs">
        <li
            v-for="item in items"
            :key="item.name"
            class="ui-tabs__item"
            :class="{
                'ui-tabs__item_active': item.active,
            }"
        >
            <component
                :is="item.link ? 'router-link' : 'div'"
                class="ui-tabs__item-content"
                :to="item.link"
            >
                <UiIcon
                    v-if="item.icon"
                    :icon="item.icon"
                    class="ui-tabs__item-icon"
                />
                <span
                    class="ui-tabs__item-name"
                >
                    {{ item.name }}
                </span>
            </component>
        </li>
    </ul>
</template>

<script lang="ts" setup>
type Item = {
    name: string,
    value: string | number,
    icon?: string,
    active?: boolean,
    link?: any,
}

interface Props {
    items: Item[],
}

withDefaults(defineProps<Props>(), {});
</script>

<style lang="scss" scoped>
.ui-tabs {
    display: flex;
    align-items: center;

    &__item {
        padding: 6px 15px;
        border-radius: 3px;
        cursor: pointer;

        &_active {
            background-color: #e1ebf4;
        }
    }

    &__item-content {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: var(--pf-global--main-color--200);
    }

    &__item-icon {
        margin-right: 10px;
    }
}
</style>