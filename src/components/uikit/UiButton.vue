<template>
    <button
        class="pf-c-button"
        :class="
            ({
                'pf-m-in-progress': progress
            },
            [typeStyle ? `pf-m-${typeStyle}` : ''])
        "
        :disabled="disabled"
        :type="type"
        :aria-label="ariaLabel"
    >
        <span v-if="progress" class="pf-c-button__progress">
            <UiSpinner class="pf-m-md" />
        </span>
        <UiIcon v-if="icon" :icon="icon" />
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import UiIcon from "./UiIcon.vue";
import UiSpinner from "./UiSpinner.vue";

interface Props {
    typeStyle?: "primary" | string;
    active?: boolean;
    disabled?: boolean;
    type?: "submit" | "button" | "reset" | undefined;
    progress?: boolean;
    icon?: string | undefined;
    ariaLabel?: string;
}

withDefaults(defineProps<Props>(), {
    type: "button",
    typeStyle: "primary"
});
</script>

<style lang="scss">
.pf-c-button {
    box-sizing: border-box;

    &.pf-m-base-light {
        --pf-c-button--disabled--Color: var(--pf-c-button--m-base-light--disabled--Color);
        --pf-c-button--disabled--BackgroundColor: var(
            --pf-c-button--m-base-light--disabled--BackgroundColor
        );
        color: var(--pf-c-button--m-base-light--Color);
        background-color: var(--pf-c-button--m-base-light--BackgroundColor);

        &:hover {
            --pf-c-button--m-base-light--Color: var(--pf-c-button--m-base-light--hover--Color);
            --pf-c-button--m-base-light--BackgroundColor: var(
                --pf-c-button--m-base-light--hover--BackgroundColor
            );
        }

        &:active,
        &.pf-m-active {
            --pf-c-button--m-base-light--Color: var(--pf-c-button--m-base-light--active--Color);
            --pf-c-button--m-base-light--BackgroundColor: var(
                --pf-c-button--m-base-light--active--BackgroundColor
            );
        }

        &:focus {
            --pf-c-button--m-base-light--Color: var(--pf-c-button--m-base-light--focus--Color);
            --pf-c-button--m-base-light--BackgroundColor: var(
                --pf-c-button--m-base-light--focus--BackgroundColor
            );
        }
    }

    &.pf-m-bright {
        --pf-c-button--disabled--Color: var(--pf-c-button--m-bright--disabled--Color);
        --pf-c-button--disabled--BackgroundColor: var(
            --pf-c-button--m-bright--disabled--BackgroundColor
        );
        color: var(--pf-c-button--m-bright--Color);
        background-color: var(--pf-c-button--m-bright--BackgroundColor);

        &:hover {
            --pf-c-button--m-bright--Color: var(--pf-c-button--m-bright--hover--Color);
            --pf-c-button--m-bright--BackgroundColor: var(
                --pf-c-button--m-bright--hover--BackgroundColor
            );
        }

        &:active,
        &.pf-m-active {
            --pf-c-button--m-bright--Color: var(--pf-c-button--m-bright--active--Color);
            --pf-c-button--m-bright--BackgroundColor: var(
                --pf-c-button--m-bright--active--BackgroundColor
            );
        }

        &:focus {
            --pf-c-button--m-bright--Color: var(--pf-c-button--m-bright--focus--Color);
            --pf-c-button--m-bright--BackgroundColor: var(
                --pf-c-button--m-bright--focus--BackgroundColor
            );
        }
    }
}
</style>
