<template>
    <div
        class="pf-u-display-flex pf-u-justify-content-center pf-u-align-items-center"
        :class="{
            'pf-u-h-100': props.h100,
            'pf-u-my-4xl': !props.h100,
        }"
    >
        <div>
            <div
                v-if="!props.hideIcon"
                class="pf-u-m-auto pf-u-w-25 pf-u-color-400 pf-u-text-align-center"
            >
                <UiIcon
                    class="pf-u-font-size-4xl"
                    :icon="'fas fa-search'"
                />
            </div>
            <div class="pf-u-font-weight-bold pf-u-text-align-center pf-u-font-size-lg pf-u-color-400 pf-u-mt-xl">
                <slot />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
    hideIcon?: boolean;
    h100?: boolean
}>();
</script>
