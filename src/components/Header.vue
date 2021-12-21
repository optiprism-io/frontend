<template>
    <header class="pf-c-page__header">
        <div class="pf-c-page__header-brand">
            <div class="pf-c-page__header-brand-toggle">
                <button
                    id="card-view-example-nav-toggle"
                    class="pf-c-button pf-m-plain"
                    type="button"
                    aria-label="Global navigation"
                    aria-expanded="true"
                    aria-controls="card-view-example-primary-nav"
                >
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
            </div>
            <a href="#" class="pf-c-page__header-brand-link"></a>
        </div>

        <div class="pf-c-page__header-tools">
            <div class="pf-c-page__header-tools-group">
                <div class="pf-c-page__header-tools-item pf-m-hidden pf-m-visible-on-lg">
                    <button class="pf-c-button pf-m-plain" type="button" aria-label="Settings">
                        <i class="fas fa-cog" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="pf-c-page__header-tools-item pf-m-hidden pf-m-visible-on-lg">
                    <button class="pf-c-button pf-m-plain" type="button" aria-label="Help">
                        <i class="pf-icon pf-icon-help" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div class="pf-c-page__header-tools-group">
                <div class="pf-c-page__header-tools-item pf-m-hidden-on-lg">
                    <div class="pf-c-dropdown">
                        <button
                            id="card-view-example-dropdown-kebab-1-button"
                            class="pf-c-dropdown__toggle pf-m-plain"
                            aria-expanded="false"
                            type="button"
                            aria-label="Actions"
                        >
                            <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
                        </button>
                        <ul
                            class="pf-c-dropdown__menu pf-m-align-right"
                            aria-labelledby="card-view-example-dropdown-kebab-1-button"
                            hidden
                        >
                            <li>
                                <a class="pf-c-dropdown__menu-item" href="#">Link</a>
                            </li>
                            <li>
                                <button class="pf-c-dropdown__menu-item" type="button">
                                    Action
                                </button>
                            </li>
                            <li>
                                <a
                                    class="pf-c-dropdown__menu-item pf-m-disabled"
                                    href="#"
                                    aria-disabled="true"
                                    tabindex="-1"
                                    >Disabled link</a
                                >
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
                    </div>
                </div>
                <div class="pf-c-page__header-tools-item pf-m-hidden pf-m-visible-on-md">
                    <div class="pf-c-dropdown">
                        <button
                            id="card-view-example-dropdown-kebab-2-button"
                            class="pf-c-dropdown__toggle pf-m-plain"
                            aria-expanded="false"
                            type="button"
                        >
                            <span class="pf-c-dropdown__toggle-text">John Smith</span>
                            <span class="pf-c-dropdown__toggle-icon">
                                <i class="fas fa-caret-down" aria-hidden="true"></i>
                            </span>
                        </button>
                        <ul
                            class="pf-c-dropdown__menu"
                            aria-labelledby="card-view-example-dropdown-kebab-2-button"
                            hidden
                        >
                            <li>
                                <a class="pf-c-dropdown__menu-item" href="#">Link</a>
                            </li>
                            <li>
                                <button class="pf-c-dropdown__menu-item" type="button">
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
                                <button class="pf-c-dropdown__menu-item" type="button" disabled>
                                    Disabled action
                                </button>
                            </li>
                            <li class="pf-c-divider" role="separator"></li>
                            <li>
                                <a class="pf-c-dropdown__menu-item" href="#">Separated link</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
const x = "header";
</script>

<style scoped></style>
