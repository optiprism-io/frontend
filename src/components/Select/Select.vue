<template>
    <VDropdown
        :shown="isOpen"
        placement="bottom-start"
        @hide="onHide"
    >
        <slot />
        <template #popper="{ hide }">
            <div class="select pf-c-card pf-m-display-lg pf-u-min-width">
                <div
                    v-if="loading"
                    class="select__loader-wrap"
                >
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
                    <div
                        class="pf-l-grid__item select__box"
                        :class="{
                            'select__box_width-auto': widthAuto,
                        }"
                    >
                        <SelectList
                            :items="itemsWithSearch"
                            :grouped="grouped"
                            :selected="selectedItem"
                            :show-search="showSearch"
                            @select="($event: any) => {hide(); select($event)}"
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
    </VDropdown>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount, watchEffect } from "vue";
import SelectList from "@/components/Select/SelectList.vue";
import UiSpinner from "@/components/uikit/UiSpinner.vue";
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
        updateOpen?: boolean;
        showSearch?: boolean;
        widthAuto?: boolean;
    }>(),
    {
        showSearch: true,
        grouped: false,
        selected: false,
        isOpenMount: false,
        updateOpen: false,
    }
);

const key = ref(0);
const isOpen = ref(false);
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

const itemsWithSearch = computed(() => {
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

const selectedDescription = computed(() => {
    let item: any = null;
    if (props.grouped) {
        itemsWithSearch.value.forEach((group: Group) => {
            group.items.forEach((groupItem: Item) => {
                if (JSON.stringify(selectedItem.value) === JSON.stringify(groupItem.item)) {
                    item = groupItem;
                }
            });
        });
    } else {
        itemsWithSearch.value.forEach((groupItem: Item) => {
            if (JSON.stringify(selectedItem.value) === JSON.stringify(groupItem.item)) {
                item = groupItem;
            }
        });
    }

    return item ? item.description : "";
});

watchEffect(() => {
    if (props.updateOpen) {
        isOpen.value = true;
    }
})

const select = (item: any): void => {
    isOpen.value = false;
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
    description.value = "";
    emit("onSearch", payload);
};

const onHide = () => {
    isOpen.value = false;
};

onBeforeMount(() => {
    isOpen.value = props.isOpenMount;
});
</script>

<style scoped lang="scss">
.select {
    position: relative;

    &__box {
        width: 20rem;

        &_width-auto {
            width: initial;
        }
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
