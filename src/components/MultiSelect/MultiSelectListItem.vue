<template>
    <li class="pf-c-menu__list-item">
        <a class="pf-c-menu__item" @click="click">
            <span class="pf-c-menu__item-main">
                <span class="pf-c-menu__item-icon">
                    <input v-model="selectedData" class="pf-c-check__input" type="checkbox" />
                </span>
                <span class="pf-c-menu__item-text">{{ text }}</span>
            </span>
        </a>
    </li>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
    item: any;
    selected: boolean;
    text: string;
}>();

const selectedData = computed({
    get: () => props.selected,
    set: val => {
        emit("select", val);
    }
});

const emit = defineEmits<{
    (e: "select", item: any): void;
    (e: "deselect", item: any): void;
}>();

const click = () => {
    if (props.selected) {
        emit("deselect", props.item);
    } else {
        emit("select", props.item);
    }
};
</script>
