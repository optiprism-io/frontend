<template>
    <div class="pf-l-flex pf-m-column">
        <Breakdown
            v-for="(breakdown, index) in breakdowns"
            :key="index"
            :breakdown="breakdown"
            :index="index"
            @remove-breakdown="removeBreakdown"
            @change-breakdown="changeBreakdown"
        />
        <div class="pf-l-flex">
            <BreakdownSelect @select="addBreakdown">
                <slot>
                    <UiButton class="pf-m-main" :is-link="true" :before-icon="'fas fa-plus'">
                        Add Breakdown
                    </UiButton>
                </slot>
            </BreakdownSelect>
        </div>
    </div>
</template>

<script setup lang="ts">
import BreakdownSelect from "./BreakdownSelect.vue";
import Breakdown from "./Breakdown.vue";
import {
    breakdownsStore as newBreakdownsStore,
    Breakdown as StoreBreakdown
} from "../../../stores/eventSegmentation/breakdowns";
import UiButton from "@/components/uikit/UiButton.vue";

const breakdownsStore = newBreakdownsStore();
const breakdowns = breakdownsStore.breakdowns;

const addBreakdown = (breakdown: StoreBreakdown): void => {
    breakdownsStore.addBreakdown(breakdown);
};

const removeBreakdown = (idx: number): void => {
    breakdownsStore.removeBreakdown(idx);
};

const changeBreakdown = (idx: number, breakdown: StoreBreakdown): void => {
    breakdownsStore.changeBreakdown(idx, breakdown);
};
</script>
