<template>
    <div class="pf-c-menu pf-m-plain pf-m-scrollable">
        <div class="pf-c-menu__search">
            <div class="pf-c-menu__search-input">
                <input
                    id="-search-input"
                    class="pf-c-form-control pf-m-search"
                    type="search"
                    name="-search-input"
                    aria-label="Search"
                />
            </div>
        </div>
        <div class="pf-c-menu__content">
            <template v-if="grouped">
                <template v-for="(group, index) in groupedItems" :key="group.name">
                    <template v-if="group.name">
                        <section class="pf-c-menu__group">
                            <hr v-if="index > 0" class="pf-c-divider" />
                            <h1 class="pf-c-menu__group-title">
                                {{ group.name }}
                            </h1>
                            <ul class="pf-c-menu__list">
                                <SelectListItem
                                    v-for="item in group.items"
                                    :key="item.name"
                                    :item="item.item"
                                    :text="item.name"
                                    :selected="selected"
                                    @hover="hover"
                                    @click="select"
                                ></SelectListItem>
                            </ul>
                        </section>
                    </template>
                    <ul v-else class="pf-c-menu__list">
                        <SelectListItem
                            v-for="item in group.items"
                            :key="item.name"
                            :item="item.item"
                            :text="item.name"
                            :selected="selected"
                            @hover="hover"
                            @click="select"
                        ></SelectListItem>
                    </ul>
                </template>
            </template>
            <template v-else>
                <ul class="pf-c-menu__list">
                    <SelectListItem
                        v-for="item in itemItems"
                        :key="item.name"
                        :item="item.item"
                        :text="item.name"
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
import { computed } from "vue";
import { Group, Item } from "./Select.vue";
import SelectListItem from "./SelectListItem.vue";

const props = defineProps<{
    items: Item[] | Group[];
    grouped: boolean;
    selected?: any;
}>();

const groupedItems = computed((): Group[] => {
    if (props.grouped) {
        return props.items as Group[];
    } else {
        return [];
    }
});

const itemItems = computed((): Item[] => {
    if (props.grouped) {
        return [];
    } else {
        return props.items as Item[];
    }
});

const emit = defineEmits<{
    (e: "select", item: any): void;
    (e: "hover", item: any): void;
}>();

const hover = (item: any): void => {
    emit("hover", item);
};

const select = (item: any): void => {
    emit("select", item);
};
</script>
