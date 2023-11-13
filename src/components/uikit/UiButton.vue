<template>
    <button
        class="ui-button pf-c-button"
        :class="{
            'pf-m-in-progress': props.progress,
            'pf-m-link': props.isLink,
        }"
        :disabled="disabled"
        :type="type"
        :aria-label="ariaLabel"
    >
        <span
            v-if="beforeIcon"
            class="pf-c-button__icon pf-m-start"
        >
            <UiIcon :icon="beforeIcon" />
        </span>
        <span
            v-if="progress"
            class="pf-c-button__progress"
        >
            <UiSpinner class="pf-m-md" />
        </span>
        <UiIcon
            v-if="icon"
            :icon="icon"
        />
        <slot />
        <span
            v-if="afterIcon"
            class="pf-c-button__icon pf-u-ml-sm"
        >
            <UiIcon :icon="afterIcon" />
        </span>
    </button>
</template>

<script setup lang="ts">
import UiSpinner from './UiSpinner.vue';
import UiIcon from '@/components/uikit/UiIcon.vue';

interface Props {
    active?: boolean;
    disabled?: boolean;
    type?: 'submit' | 'button' | 'reset' | undefined;
    progress?: boolean;
    icon?: string | undefined;
    ariaLabel?: string;
    beforeIcon?: string;
    isLink?: boolean;
    afterIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'button',
    beforeIcon: '',
    icon: '',
    ariaLabel: ''
});
</script>

<style lang="scss">
.ui-button.pf-c-button.pf-m-secondary {
    --pf-c-button--m-secondary--BackgroundColor: #FFF;
}
</style>
