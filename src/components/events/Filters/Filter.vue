<template>
  <div class="pf-l-flex" @mouseenter="showControls=true" @mouseleave="showControls=false">
    <div class="pf-l-flex__item selected-list-item__identifier">{{ identifier }}.</div>
    <div class="pf-c-action-list">
      <div class="pf-c-action-list__item">
        <RefSelect @select="changeRef" :selected="filter.ref">
          <button class="pf-c-button pf-m-secondary" type="button" v-if="filter.ref.type===filterType.Cohort">
            <span class="pf-c-button__icon pf-m-start">
                <i class="fas fa-user-friends" aria-hidden="true"
                   @click.stop="removeValueButton(value)"></i>
              </span>
            {{ refName(filter.ref) }}
          </button>
          <button class="pf-c-button pf-m-secondary" type="button" v-else>
            {{ refName(filter.ref) }}
          </button>
        </RefSelect>
      </div>

      <div class="pf-c-action-list__item">
        <OperationSelect @select="changeOperation" :filter-ref="filter.ref" :selected="filter.opId">
          <button class="pf-c-button pf-m-secondary" type="button">
            {{ operationById.get(filter.opId).name }}
          </button>
        </OperationSelect>
      </div>

      <div class="pf-c-action-list__item">
        <ValueSelect @select="addValue" @deselect="removeValue" :filter-ref="filter.ref"
                     :selected="filter.values">
          <template v-if="filter.values.length>0">
            <div class="pf-c-action-list">
              <div class="pf-c-action-list__item" v-for="value in filter.values">
                <button class="pf-c-button pf-m-secondary" type="button">
                  {{ value }}

                  <span class="pf-c-button__icon pf-m-end">
                <i class="fas fa-times" aria-hidden="true" :data-value="value"
                   @click.stop="removeValueButton(value)"></i>
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

      <div class="pf-c-action-list__item" v-show="showControls">
        <button class="pf-c-button pf-m-plain" type="button" aria-label="Remove" @click="removeFilter">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Filter, FilterRef, FilterType} from "../../../stores/eventSegmentation/filters";
import {lexiconStore} from "../../../stores/lexicon";
import RefSelect from "./RefSelect.vue";
import OperationSelect from "./OperationSelect.vue";
import ValueSelect from "./ValueSelect.vue";
import {operationById, OperationId, PropertyRef, PropertyType, Value} from "../../../types";
import {computed, ref} from "vue";

const props = defineProps<{
  filter: Filter;
  index: number;
}>()

let showControls = ref(false);
let filterType = ref(FilterType);

const emit = defineEmits<{
  (e: 'removeFilter', index: number): void
  (e: 'changeFilterRef', filterIdx: number, propRef: PropertyRef): void
  (e: 'changeFilterOperation', filterIdx: number, opId: OperationId): void
  (e: 'addFilterValue', filterIdx: number, value: Value): void
  (e: 'removeFilterValue', filterIdx: number, value: Value): void
}>()
const lexicon = lexiconStore();

const removeFilter = (): void => {
  emit('removeFilter', props.index);
}

const changeRef = (propRef: PropertyRef): void => {
  emit('changeFilterRef', props.index, propRef)
}

const changeOperation = (opId: OperationId): void => {
  emit('changeFilterOperation', props.index, opId)
}

const addValue = (value: Value): void => {
  emit('addFilterValue', props.index, value)
}

const removeValue = (value: Value) => {
  emit('removeFilterValue', props.index, value)
}

const removeValueButton = (value: Value) => {
  emit('removeFilterValue', props.index, value)
}
const refName = (ref: FilterRef): string => {
  if (ref.type === FilterType.UserProperty && ref.id) {
    return lexicon.findUserPropertyById(ref.id).name;
  } else if (ref.type === FilterType.UserCustomProperty && ref.id) {
    return lexicon.findUserCustomPropertyById(ref.id).name;
  } else if (ref.type === FilterType.Cohort) {
    return 'Cohort'
  }

  throw new Error("unhandled");
};

const identifier = computed((): number => props.index + 1)
</script>