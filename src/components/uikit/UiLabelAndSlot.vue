<template>
    <div class="pf-l-flex pf-m-column pf-m-space-items-none">
        <span
            v-if="!hideLabel"
            id="label-group-category-label"
            class="pf-c-label-group__label pf-u-font-weight-bold"
        >
            {{ label }} 
        </span>
        <slot />
    </div>
</template>

<script setup lang="ts">
export interface Props {
  label: string;
  hideLabel?: boolean
}

withDefaults(defineProps<Props>(), {
    hideLabel: false
});
</script>
