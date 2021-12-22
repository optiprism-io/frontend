<template>
    <div class="pf-c-dropdown">
        <Popper ref="popper" placement="bottom-end">
            <UiButton class="pf-m-bright">
                <span class="pf-c-dropdown__toggle-text">{{ value }}</span>
                <span class="pf-c-dropdown__toggle-icon">
                    <i class="fas fa-caret-down" aria-hidden="true"></i>
                </span>
            </UiButton>
            <template #content>
                <ul
                    class="pf-c-dropdown__menu"
                    aria-labelledby="card-view-example-dropdown-kebab-2-button"
                >
                    <li>
                        <a class="pf-c-dropdown__menu-item" href="#">Link</a>
                    </li>
                    <li>
                        <button class="pf-c-dropdown__menu-item" type="button">Action</button>
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
                        <button class="pf-c-dropdown__menu-item" type="button" disabled>
                            Disabled action
                        </button>
                    </li>
                    <li class="pf-c-divider" role="separator"></li>
                    <li>
                        <a class="pf-c-dropdown__menu-item" href="#">Separated link</a>
                    </li>
                </ul>
            </template>
        </Popper>
    </div>
</template>

<script setup lang="ts">
import Popper from "vue3-popper";
import UiButton from "./UiButton.vue";

defineProps<{
    value?: string;
}>();
</script>

<style lang="scss">
.pf-c-dropdown {
    &__menu {
        position: initial;
    }
}
</style>
