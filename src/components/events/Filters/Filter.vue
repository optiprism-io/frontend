<template>
  <div class="pf-l-flex" @mouseenter="showControls=true" @mouseleave="showControls=false">
    <div class="pf-l-flex__item selected-list-item__identifier">{{ identifier }}.</div>
    <div class="pf-c-action-list">
      <div class="pf-c-action-list__item">
        <PropertySelect @select="changeProperty" :selected="filter.propRef">
          <button class="pf-c-button pf-m-secondary" type="button">
            {{ propertyName(filter.propRef) }}
          </button>
        </PropertySelect>
      </div>

      <div class="pf-c-action-list__item" v-if="filter.propRef">
        <OperationSelect @select="changeOperation" :property-ref="filter.propRef" :selected="filter.opId">
          <button class="pf-c-button pf-m-secondary" type="button">
            {{ operationById.get(filter.opId).name }}
          </button>
        </OperationSelect>
      </div>

      <div class="pf-c-action-list__item" v-if="filter.propRef">
        <ValueSelect @select="addValue" @deselect="removeValue" :property-ref="filter.propRef"
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
import {Filter} from "../../../stores/eventSegmentation/filters";
import {lexiconStore} from "../../../stores/lexicon";
import PropertySelect from "./PropertySelect.vue";
import OperationSelect from "./OperationSelect.vue";
import ValueSelect from "./ValueSelect.vue";
import {EventRef, EventType, PropertyRef, PropertyType, operationById, OperationId, Value} from "../../../types";
import {computed, onMounted, onUpdated, ref} from "vue";

const props = defineProps<{
  filter: Filter;
  index: number;
}>()

let showControls = ref(false);

const emit = defineEmits<{
  (e: 'removeFilter', index: number): void
  (e: 'changeFilterProperty', filterIdx: number, propRef: PropertyRef): void
  (e: 'changeFilterOperation', filterIdx: number, opId: OperationId): void
  (e: 'addFilterValue', filterIdx: number, value: Value): void
  (e: 'removeFilterValue', filterIdx: number, value: Value): void
}>()
const lexicon = lexiconStore();

const removeFilter = (): void => {
  emit('removeFilter', props.index);
}

const changeProperty = (propRef: PropertyRef): void => {
  emit('changeFilterProperty', props.index, propRef)
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
const propertyName = (ref: PropertyRef): string => {
  switch (ref.type) {
    case PropertyType.Event:
      return lexicon.findEventPropertyById(ref.id).name;
    case PropertyType.EventCustom:
      return lexicon.findEventCustomPropertyById(ref.id).name;
    case PropertyType.User:
      return lexicon.findUserPropertyById(ref.id).name;
    case PropertyType.UserCustom:
      return lexicon.findUserCustomPropertyById(ref.id).name;
  }
  throw new Error("unhandled");
};

const identifier = computed((): number => props.index + 1)
</script>