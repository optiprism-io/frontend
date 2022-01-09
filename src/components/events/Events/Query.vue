<template>
    <div class="queries pf-l-flex">
        <div class="pf-c-action-list">
            <div class="pf-c-action-list__item pf-u-ml-2xl min-w-50 pf-u-text-align-right">
                query
            </div>
            <div class="pf-c-action-list__item">
                <Select
                    v-if="item.queryRef"
                    :items="lexiconStore.eventsQueries"
                    :selected="eventRef"
                    @select="changeQuery"
                >
                    <UiButton class="pf-m-main pf-m-secondary">
                        {{ queryName(item.queryRef) }}
                    </UiButton>
                </Select>
                <Select
                    v-else
                    :items="lexiconStore.eventsQueries"
                    :selected="eventRef"
                    :update-open="updateOpen"
                    @select="changeQuery"
                >
                    <UiButton
                        :before-icon="'fas fa-plus-circle'"
                        class="pf-m-main pf-m-primary"
                        type="button"
                    >
                        Select Query
                    </UiButton>
                </Select>
            </div>
            <div
                v-if="!noDelete"
                class="pf-c-action-list__item queries__control-item"
                @click="removeQuery"
            >
                <VTooltip popper-class="gavno">
                    <UiIcon icon="fas fa-times" />
                    <template #popper>
                        Remove event
                    </template>
                </VTooltip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { EventQuery } from "@/stores/eventSegmentation/events";
import { useLexiconStore } from "@/stores/lexicon";
import { EventRef, EventQueryRef } from "@/types";

import Select from "@/components/Select/Select.vue";

const lexiconStore = useLexiconStore();

const props = defineProps<{
    eventRef: EventRef;
    item: EventQuery;
    index: number;
    updateOpen?: boolean;
    noDelete?: boolean;
}>();

const emit = defineEmits<{
    (e: "removeQuery", index: number): void;
    (e: "changeQuery", queryIdx: number, queryRef: EventQueryRef): void;
}>();

const changeQuery = (payload: EventQueryRef) => {
    emit("changeQuery", props.index, payload);
}

const removeQuery = () => {
    emit("removeQuery", props.index);
}

const queryName = (ref: EventQueryRef): string | undefined => {
    const query = lexiconStore.findQuery(ref);
    return query ? query.name : props.item?.queryRef?.name;
};
</script>

<style scoped lang="scss">
.queries {
    &:hover {
        .queries__control-item {
            opacity: 1;
        }
    }

    &__control-item {
        opacity: 0;
        cursor: pointer;
    }
}
</style>
