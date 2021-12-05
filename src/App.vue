<script setup lang="ts">
import Events from "./components/events/Events/Events.vue";
import Breakdowns from "./components/events/Breakdowns/Breakdowns.vue";
import Filters from "./components/events/Filters/Filters.vue";
import Header from './components/Header.vue'
</script>

<template>
  <div class="pf-c-page" id="card-view-example">
    <a
        class="pf-c-skip-to-content pf-c-button pf-m-primary"
        href="#main-content-card-view-example"
    >Skip to content</a>
    <Header/>
    <main
        class="pf-c-page__main"
        tabindex="-1"
        id="main-content-card-view-example"
    >
      <section class="pf-c-page__main-section pf-m-light">
        <div class="pf-c-content">
          <h1>Untitled query</h1>
          <p>This is a demo that showcases PatternFly cards.</p>
        </div>
      </section>
      <section class="pf-c-page__main-section">
        <div class="pf-l-grid pf-m-gutter">
          <div class="pf-l-grid__item pf-m-6-col">
            <div class="pf-c-card pf-m-hoverable pf-m-compact">
              <div class="pf-c-card__title">
                <p>Events</p>
              </div>
              <div class="pf-c-card__body">
                <Events/>
              </div>
            </div>
          </div>
          <div class="pf-l-grid__item pf-m-6-col pf-m-4-row">
          </div>
          <div class="pf-l-grid__item pf-m-6-col">
            <div class="pf-c-card pf-m-hoverable pf-m-compact">
              <div class="pf-c-card__title">
                <p>Filters</p>
              </div>
              <div class="pf-c-card__body">
                <Filters/>
              </div>
            </div>
          </div>
          <div class="pf-l-grid__item pf-m-6-col">
            <div class="pf-c-card pf-m-hoverable pf-m-compact">
              <div class="pf-c-card__title">
                <p>Breakdowns</p>
              </div>
              <div class="pf-c-card__body">
                <Breakdowns/>
              </div>
            </div>
          </div>

          <div class="pf-l-grid__item pf-m-6-col">
            <div class="pf-c-card pf-m-hoverable pf-m-compact">
              <div class="pf-c-card__title">
                <p>Breakdowns</p>
              </div>
              <div class="pf-c-card__body">
                <Breakdowns/>
              </div>
            </div>
          </div>
          <div class="pf-l-grid__item pf-m-12-col">12 col</div>
        </div>

      </section>


    </main>
  </div>
</template>

<style>
:root {
  --pf-global--spacer--md: .7rem;
  --pf-global--FontSize--md: 0.9rem;
  --pf-c-page__main-section--PaddingTop: 1rem;
  --pf-global--gutter: .7rem;
}
</style>