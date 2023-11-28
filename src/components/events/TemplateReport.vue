<template>
    <div class="template-report">
        <div class="template-report__content pf-u-mb-md">
            <div
                v-if="loading"
                class="template-report__loading pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center"
            >
                <UiSpinner />
            </div>
            <slot name="content" />
        </div>
        <div class="template-report__views">
            <slot name="views" />
        </div>
    </div>
</template>

<script lang="ts" setup>
type Props = {
    loading?: boolean
};

defineProps<Props>();
</script>

<style lang="scss">
.template-report {
    &__content {
        position: relative;
    }
    &__loading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
}
</style>
