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
                    :selected="item.queryRef"
                    @select="changeQuery"
                >
                    <UiButton class="pf-m-main pf-m-secondary">
                        {{ queryInfo?.displayName }}
                    </UiButton>
                </Select>
                <Select
                    v-else
                    :items="lexiconStore.eventsQueries"
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
                v-if="showOnlyAggregate"
                class="pf-c-action-list__item pf-u-text-align-right"
            >
                {{ aggregateString }}
            </div>
            <div
                v-if="showOnlyAggregate"
                class="pf-c-action-list__item"
            >
                <Select
                    :items="lexiconStore.eventsQueryAggregates"
                    :selected="selectedAggregateRef"
                    :show-search="false"
                    :width-auto="true"
                    @select="changeQueryAggregate"
                >
                    <UiButton
                        class="pf-m-main"
                        :before-icon="!selectedAggregateRef && 'fas fa-plus-circle'"
                        :class="{
                            'pf-m-secondary': selectedAggregateRef,
                            'pf-m-primary': !selectedAggregateRef,
                        }"
                    >
                        {{ selectAggregateName }}
                    </UiButton>
                </Select>
            </div>
            <div
                v-if="!noDelete"
                class="pf-c-action-list__item queries__control-item"
                @click="removeQuery"
            >
                <VTooltip>
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
import { computed } from "vue";
import { EventQuery } from "@/stores/eventSegmentation/events";
import { useLexiconStore } from "@/stores/lexicon";
import { useEventsStore, Events } from "@/stores/eventSegmentation/events";
import { EventRef, EventQueryRef, EventsQuery, AggregateRef } from "@/types";
import Select from "@/components/Select/Select.vue";
import { Item } from "@/components/Select/SelectTypes";

const eventsStore: Events = useEventsStore();
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

const queryInfo = computed((): EventsQuery | undefined => {
    return lexiconStore.findQuery(props.item.queryRef);
});

const showOnlyAggregate = computed(() => {
    return queryInfo.value?.hasAggregate && !queryInfo.value?.hasProperty;
});

const selectedAggregate = computed((): Item | undefined => {
    return props.item?.queryRef?.typeAggregate ? lexiconStore.eventsQueryAggregates.find(item => props.item?.queryRef?.typeAggregate === item.item.typeAggregate) : undefined;
});

const selectAggregateName = computed((): string => {
    return selectedAggregate.value?.name || 'Select agregate';
});

const selectedAggregateRef = computed((): AggregateRef | undefined => {
    return selectedAggregate.value?.item || undefined;
});

const aggregateString = computed((): string => {
    return `${eventsStore.group}, agregate by`;
});

const changeQueryAggregate = (payload: AggregateRef) => {
    if (props.item.queryRef) {
        emit("changeQuery", props.index, {
            ...props.item.queryRef,
            ...payload,
        });
    }
};

const changeQuery = (payload: EventQueryRef) => {
    emit("changeQuery", props.index, payload);
}

const removeQuery = () => {
    emit("removeQuery", props.index);
}

const queryName = (ref: EventQueryRef): string | undefined => {
    const query = lexiconStore.findQueryItem(ref);
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
