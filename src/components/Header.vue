<template>
    <header class="op-header">
        <div class="pf-l-flex pf-m-justify-content-space-between">
            <div class="pf-l-flex__item">
                <div class="op-header__menu">
                    <UiDropdown :value="'MyShop'" />
                </div>
            </div>
            <div class="pf-l-flex__item">
                <div class="op-header__tools">
                    <div class="pf-c-page__header-tools-group">
                        <div class="pf-c-page__header-tools-item">
                            <UiButton
                                :icon="'fas fa-cog'"
                                class="pf-m-base-light"
                                aria-label="Settings"
                            />
                        </div>
                        <div class="pf-c-page__header-tools-item">
                            <UiButton
                                :icon="'pf-icon pf-icon-help'"
                                class="pf-m-base-light"
                                aria-label="Help"
                            />
                        </div>
                    </div>
                    <div class="pf-c-page__header-tools-group">
                        <div class="pf-c-page__header-tools-item">
                            <UiDropdown :value="'Jone Smith'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import UiDropdown from "@/components/uikit/UiDropdown.vue";
</script>

<style scoped lang="scss">
.op-header {
    padding: 8px 15px;
    grid-area: header;
    background-color: var(--op-base-color);

    &__tools {
        margin-left: auto;
        display: flex;
        color: #fff;
    }
}
</style>
