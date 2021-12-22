<script setup lang="ts">
import Events from "./components/events/Events/Events.vue";
import Breakdowns from "./components/events/Breakdowns/Breakdowns.vue";
import Filters from "./components/events/Filters/Filters.vue";
import Header from "./components/Header.vue";
</script>

<template>
    <div class="pf-c-page">
        <Header />
        <main class="pf-c-page__main">
            <section class="pf-c-page__main-section">
                <div class="pf-l-grid pf-m-gutter">
                    <div class="pf-l-grid__item pf-m-6-col">
                        <div class="pf-c-card pf-m-hoverable pf-m-compact">
                            <div class="pf-c-card__title">
                                <p>Events</p>
                            </div>
                            <div class="pf-c-card__body">
                                <Events />
                            </div>
                        </div>
                    </div>
                    <div class="pf-l-grid__item pf-m-6-col">
                        <div class="pf-c-card pf-m-hoverable pf-m-compact">
                            <div class="pf-c-card__title"><p>Segments</p></div>
                            <div class="pf-c-card__body">
                                <Breakdowns />
                            </div>
                        </div>
                    </div>
                    <div class="pf-l-grid__item pf-m-6-col">
                        <div class="pf-c-card pf-m-hoverable pf-m-compact">
                            <div class="pf-c-card__title">
                                <p>Filters</p>
                            </div>
                            <div class="pf-c-card__body">
                                <Filters />
                            </div>
                        </div>
                    </div>
                    <div class="pf-l-grid__item pf-m-6-col">
                        <div class="pf-c-card pf-m-hoverable pf-m-compact">
                            <div class="pf-c-card__title">
                                <p>Breakdowns</p>
                            </div>
                            <div class="pf-c-card__body">
                                <Breakdowns />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<style lang="scss">
:root {
    --pf-global--spacer--md: 0.7rem;
    --pf-global--FontSize--md: 0.9rem;
    --pf-c-page__main-section--PaddingTop: 1rem;
    --pf-global--gutter: 0.7rem;
}

.pf-c-page {
    background-color: var(--op-base-background);
    height: 100vh;

    &__main-section {
        padding: var(--pf-global--spacer--md);
    }
}
</style>
