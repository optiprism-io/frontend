<template>
    <UiPopper v-model="show">
        <slot></slot>
        <template #content>
            <div class="select pf-c-card pf-m-display-lg pf-u-min-width">
                <div v-if="loading" class="select__loader-wrap">
                    <UiSpinner class="select__loader" />
                </div>
                <div
                    v-else
                    class="pf-l-grid"
                    :class="{
                        'pf-m-all-12-col': !selectedDescription,
                        'pf-m-all-6-col': selectedDescription
                    }"
                >
                    <div class="pf-l-grid__item select__box">
                        <SelectList
                            :items="itemsWithSearch"
                            :grouped="grouped"
                            :selected="selectedItem"
                            @select="select($event)"
                            @hover="hover"
                            @on-search="onSearch"
                        />
                    </div>
                    <div
                        v-if="selectedDescription"
                        class="pf-l-grid__items select__box select__description"
                    >
                        <div class="pf-c-card__body pf-u-color-200">
                            <div class="pf-u-mb-md pf-u-font-size-2xl pf-u-icon-color-light">
                                <UiIcon icon="fas fa-info-circle" />
                            </div>
                            <div class="pf-u-font-size-lg">
                                {{ selectedDescription }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </UiPopper>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, onBeforeMount } from "vue";
import UiPopper from "@/components/uikit/UiPopper.vue";
import SelectList from "@/components/Select/SelectList.vue";
import UiSpinner from "@/components/uikit/UiSpinner.vue";
import UiIcon from "@/components/uikit/UiIcon.vue";
import { Group, Item } from "@/components/Select/SelectTypes";

const emit = defineEmits<{
    (e: "select", item: any): void;
    (e: "onSearch", payload: string): void;
    (e: "onHover", item: any): void;
}>();

const props = withDefaults(
    defineProps<{
        items: any;
        grouped?: boolean;
        selected?: any;
        loading?: boolean;
        isOpenMount?: boolean;
    }>(),
    {
        grouped: false,
        selected: false,
        isOpenMount: false
    }
);

const key = ref(0);
const show = ref(false);
const selectedItemLocal = ref(false);
const search = ref("");
const description = ref();

const firstElement = computed(() => props.items[0]);

const selectedItem = computed(() => {
    if (props.grouped) {
        return selectedItemLocal.value || props.selected || firstElement.value?.items[0]?.item;
    } else {
        return selectedItemLocal.value || props.selected || firstElement.value?.item;
    }
});

const selectedDescription = computed(() => {
    let item: any = null;
    if (props.grouped) {
        props.items.forEach((group: Group) => {
            group.items.forEach((groupItem: Item) => {
                if (JSON.stringify(selectedItem.value) === JSON.stringify(groupItem.item)) {
                    item = groupItem;
                }
            });
        });
    } else {
        props.items.forEach((groupItem: Item) => {
            if (JSON.stringify(selectedItem.value) === JSON.stringify(groupItem.item)) {
                item = groupItem;
            }
        });
    }
    return item ? item.description : "";
});

const itemsWithSearch = computed((): Group[] | Item[] => {
    if (search.value) {
        if (props.grouped) {
            return props.items.reduce((acc: Group[], item: Group) => {
                const innerItems: Item[] = item.items.filter(item => {
                    const name = item.name.toLowerCase();

                    return name.search(search.value) >= 0;
                });

                if (innerItems.length) {
                    acc.push({
                        ...item,
                        items: innerItems
                    });
                }

                return acc;
            }, []);
        } else {
            return props.items.filter((item: any) => {
                const name = item.name.toLowerCase();

                return name.search(search.value) >= 0;
            });
        }
    } else {
        return props.items;
    }
});

const select = (item: any): void => {
    show.value = false;
    selectedItemLocal.value = false;
    key.value++;
    emit("select", item);
};

const hover = (item: Item): void => {
    if (item) {
        description.value = item?.description || "";
        selectedItemLocal.value = item.item;
        emit("onHover", item);
    }
};

const onSearch = (payload: string) => {
    search.value = payload.toLowerCase();
    emit("onSearch", payload);
};

onBeforeMount(() => {
    show.value = props.isOpenMount;
});
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
        border-left: 1px solid var(--pf-global--BackgroundColor--200);
    }
}
</style>
