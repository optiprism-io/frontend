<template>
    <div class="ui-dropdown">
        <VDropdown placement="bottom-end">
            <div class="pf-c-dropdown">
                <UiButton class="pf-m-bright">
                    <span class="pf-c-dropdown__toggle-text">{{ value }}</span>
                    <span class="pf-c-dropdown__toggle-icon">
                        <i
                            class="fas fa-caret-down"
                            aria-hidden="true"
                        />
                    </span>
                </UiButton>
            </div>

            <template #popper>
                <div class="pf-c-dropdown">
                    <ul
                        class="pf-c-dropdown__menu"
                        aria-labelledby="card-view-example-dropdown-kebab-2-button"
                    >
                        <li>
                            <a
                                class="pf-c-dropdown__menu-item"
                                href="#"
                            >Link</a>
                        </li>
                        <li>
                            <button
                                class="pf-c-dropdown__menu-item"
                                type="button"
                            >
                                Action
                            </button>
                        </li>
                        <li>
                            <a
                                class="pf-c-dropdown__menu-item pf-m-disabled"
                                href="#"
                                aria-disabled="true"
                                tabindex="-1"
                            >
                                Disabled link
                            </a>
                        </li>
                        <li>
                            <button
                                class="pf-c-dropdown__menu-item"
                                type="button"
                                disabled
                            >
                                Disabled action
                            </button>
                        </li>
                        <li
                            class="pf-c-divider"
                            role="separator"
                        />
                        <li>
                            <a
                                class="pf-c-dropdown__menu-item"
                                href="#"
                            >Separated link</a>
                        </li>
                    </ul>
                </div>
            </template>
        </VDropdown>
    </div>
</template>

<script setup lang="ts">
import UiButton from "./UiButton.vue";

defineProps<{
    value?: string;
}>();
</script>

<style lang="scss">
.v-popper {
    &--theme-dropdown {
        .v-popper__arrow-container {
            display: none;
        }
        .v-popper {
            &__inner {
                padding: 0;
                border-radius: 0;
                border: initial;
            }
        }
    }
}

.pf-c-dropdown {
    &__menu {
        position: initial;
    }
}
</style>
