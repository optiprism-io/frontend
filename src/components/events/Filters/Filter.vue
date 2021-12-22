<template>
    <div class="pf-l-flex" @mouseenter="showControls = true" @mouseleave="showControls = false">
        <div class="pf-l-flex__item selected-list-item__identifier">{{ identifier }}.</div>
        <div class="pf-c-action-list">
            <div class="pf-c-action-list__item">
                <RefSelect :selected="filter.ref" @select="changeRef">
                    <button
                        v-if="isFilterCohort(filter.ref)"
                        class="pf-c-button pf-m-secondary"
                        type="button"
                    >
                        <span class="pf-c-button__icon pf-m-start">
                            <i
                                class="fas fa-user-friends"
                                aria-hidden="true"
                                @click.stop="removeValueButton(filter.opId)"
                            ></i>
                        </span>
                        {{ refName(filter.ref) }}
                    </button>
                    <button v-else class="pf-c-button pf-m-secondary" type="button">
                        {{ refName(filter.ref) }}
                    </button>
                </RefSelect>
            </div>

            <div class="pf-c-action-list__item">
                <OperationSelect
                    :filter-ref="filter.ref"
                    :selected="filter.opId"
                    @select="changeOperation"
                >
                    <button class="pf-c-button pf-m-secondary" type="button">
                        {{ operationById?.get(filter.opId)?.name }}
                    </button>
                </OperationSelect>
            </div>

            <div class="pf-c-action-list__item">
                <ValueSelect
                    :filter-ref="filter.ref"
                    :selected="filter.values"
                    @add="addValue"
                    @deselect="removeValue"
                >
                    <template v-if="filter.values.length > 0">
                        <div class="pf-c-action-list">
                            <div
                                v-for="(value, i) in filter.values"
                                :key="i"
                                class="pf-c-action-list__item"
                            >
                                <button class="pf-c-button pf-m-secondary" type="button">
                                    {{ value }}

                                    <span class="pf-c-button__icon pf-m-end">
                                        <i
                                            class="fas fa-times"
                                            aria-hidden="true"
                                            :data-value="value"
                                            @click.stop="removeValueButton(value)"
                                        ></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <button class="pf-c-button pf-m-primary" type="button">
                            <span class="pf-c-button__icon pf-m-start">
                                <i class="fas fa-plus-circle" aria-hidden="true"></i>
                            </span>
                            Select value
                        </button>
                    </template>
                </ValueSelect>
            </div>

            <div v-show="showControls" class="pf-c-action-list__item">
                <button
                    class="pf-c-button pf-m-plain"
                    type="button"
                    aria-label="Remove"
                    @click="removeFilter"
                >
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Filter,
    FilterRef,
    FilterRefUserCustomProperty,
    FilterRefUserProperty,
    isFilterCohort,
    isFilterUserCustomProperty,
    isFilterUserProperty
} from "../../../stores/eventSegmentation/filters";
import { lexiconStore } from "../../../stores/lexicon";
import RefSelect from "./RefSelect.vue";
import OperationSelect from "./OperationSelect.vue";
import ValueSelect from "./ValueSelect.vue";
import {
    operationById,
    OperationId,
    PropertyRef,
    PropertyType,
    UserProperty,
    Value
} from "../../../types";
import { computed, ref } from "vue";

const props = defineProps<{
    filter: Filter;
    index: number;
}>();

let showControls = ref(false);

const emit = defineEmits<{
    (e: "removeFilter", index: number): void;
    (e: "changeFilterRef", filterIdx: number, propRef: FilterRef): void;
    (e: "changeFilterOperation", filterIdx: number, opId: OperationId): void;
    (e: "addFilterValue", filterIdx: number, value: Value): void;
    (e: "removeFilterValue", filterIdx: number, value: Value): void;
}>();
const lexicon = lexiconStore();

const removeFilter = (): void => {
    emit("removeFilter", props.index);
};

const changeRef = (propRef: FilterRef): void => {
    emit("changeFilterRef", props.index, propRef);
};

const changeOperation = (opId: OperationId): void => {
    emit("changeFilterOperation", props.index, opId);
};

const addValue = (value: Value): void => {
    emit("addFilterValue", props.index, value);
};

const removeValue = (value: Value) => {
    emit("removeFilterValue", props.index, value);
};

const removeValueButton = (value: Value) => {
    emit("removeFilterValue", props.index, value);
};
const refName = (ref: FilterRef): string => {
    if (isFilterUserProperty(ref)) {
        return lexicon.findUserPropertyById((ref as FilterRefUserProperty).id).name;
    } else if (isFilterUserCustomProperty(ref)) {
        return lexicon.findUserCustomPropertyById((ref as FilterRefUserProperty).id).name;
    } else if (isFilterCohort(ref)) {
        return "Cohort";
    }

    throw new Error("unhandled");
};

const identifier = computed((): number => props.index + 1);
</script>
