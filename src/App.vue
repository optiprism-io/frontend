<script setup lang="ts">
import Events from "./components/events/Events.vue";
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
          <div class="pf-l-grid__item pf-m-6-col">

          </div>
          <div class="pf-l-grid__item pf-m-6-col">
            <div class="pf-c-toolbar pf-m-page-insets" id="primary-detail-expanded-example-toolbar">
              <div class="pf-c-toolbar__content">
                <div class="pf-c-toolbar__content-section pf-m-nowrap">
                  <div class="pf-c-toolbar__group pf-m-toggle-group pf-m-show-on-xl">
                    <div class="pf-c-toolbar__toggle">
                      <button class="pf-c-button pf-m-plain" type="button" aria-label="Show filters"
                              aria-expanded="false"
                              aria-controls="primary-detail-expanded-example-toolbar-expandable-content">
                        <i class="fas fa-filter" aria-hidden="true"></i>
                      </button>
                    </div>

                    <div class="pf-c-toolbar__item pf-m-search-filter">
                      <div class="pf-c-input-group" aria-label="search filter" role="group">
                        <div class="pf-c-dropdown">
                          <button class="pf-c-dropdown__toggle" id="primary-detail-expanded-example-toolbar--button"
                                  aria-expanded="false" type="button">
                            <span class="pf-c-dropdown__toggle-text">Name</span>
                            <span class="pf-c-dropdown__toggle-icon">
                                <i class="fas fa-caret-down" aria-hidden="true"></i>
                              </span>
                          </button>
                          <ul class="pf-c-dropdown__menu"
                              aria-labelledby="primary-detail-expanded-example-toolbar--button" hidden="">
                            <li>
                              <a class="pf-c-dropdown__menu-item" href="#">Link</a>
                            </li>
                            <li>
                              <button class="pf-c-dropdown__menu-item" type="button">Action</button>
                            </li>
                            <li>
                              <a class="pf-c-dropdown__menu-item pf-m-disabled" href="#" aria-disabled="true"
                                 tabindex="-1">Disabled link</a>
                            </li>
                            <li>
                              <button class="pf-c-dropdown__menu-item" type="button" disabled="">Disabled action
                              </button>
                            </li>
                            <li class="pf-c-divider" role="separator"></li>
                            <li>
                              <a class="pf-c-dropdown__menu-item" href="#">Separated link</a>
                            </li>
                          </ul>
                        </div>
                        <input class="pf-c-form-control" type="search"
                               id="primary-detail-expanded-example-toolbar--search-filter-input"
                               name="primary-detail-expanded-example-toolbar-search-filter-input"
                               aria-label="input with dropdown and button"
                               aria-describedby="primary-detail-expanded-example-toolbar--button">
                      </div>
                    </div>

                    <div class="pf-c-toolbar__group pf-m-filter-group">
                      <div class="pf-c-toolbar__item">
                        <div class="pf-c-select">
                          <span id="primary-detail-expanded-example-toolbar-select-checkbox-status-label" hidden="">Choose one</span>

                          <button class="pf-c-select__toggle" type="button"
                                  id="primary-detail-expanded-example-toolbar-select-checkbox-status-toggle"
                                  aria-haspopup="true" aria-expanded="false"
                                  aria-labelledby="primary-detail-expanded-example-toolbar-select-checkbox-status-label primary-detail-expanded-example-toolbar-select-checkbox-status-toggle">
                            <div class="pf-c-select__toggle-wrapper">
                              <span class="pf-c-select__toggle-text">Status</span>
                            </div>
                            <span class="pf-c-select__toggle-arrow">
                                <i class="fas fa-caret-down" aria-hidden="true"></i>
                              </span>
                          </button>

                          <div class="pf-c-select__menu" hidden="">
                            <fieldset class="pf-c-select__menu-fieldset" aria-label="Select input">
                              <label class="pf-c-check pf-c-select__menu-item pf-m-description"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-status-active">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-status-active"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-status-active">

                                <span class="pf-c-check__label">Active</span>
                                <span class="pf-c-check__description">This is a description</span>
                              </label>
                              <label class="pf-c-check pf-c-select__menu-item pf-m-description"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-status-canceled">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-status-canceled"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-status-canceled">

                                <span class="pf-c-check__label">Canceled</span>
                                <span class="pf-c-check__description">This is a really long description that describes the menu item. This is a really long description that describes the menu item.</span>
                              </label>
                              <label class="pf-c-check pf-c-select__menu-item"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-status-paused">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-status-paused"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-status-paused">

                                <span class="pf-c-check__label">Paused</span>
                              </label>
                              <label class="pf-c-check pf-c-select__menu-item"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-status-warning">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-status-warning"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-status-warning">

                                <span class="pf-c-check__label">Warning</span>
                              </label>
                              <label class="pf-c-check pf-c-select__menu-item"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-status-restarted">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-status-restarted"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-status-restarted">

                                <span class="pf-c-check__label">Restarted</span>
                              </label>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                      <div class="pf-c-toolbar__item">
                        <div class="pf-c-select">
                          <span id="primary-detail-expanded-example-toolbar-select-checkbox-risk-label" hidden="">Choose one</span>

                          <button class="pf-c-select__toggle" type="button"
                                  id="primary-detail-expanded-example-toolbar-select-checkbox-risk-toggle"
                                  aria-haspopup="true" aria-expanded="false"
                                  aria-labelledby="primary-detail-expanded-example-toolbar-select-checkbox-risk-label primary-detail-expanded-example-toolbar-select-checkbox-risk-toggle">
                            <div class="pf-c-select__toggle-wrapper">
                              <span class="pf-c-select__toggle-text">Risk</span>
                            </div>
                            <span class="pf-c-select__toggle-arrow">
                                <i class="fas fa-caret-down" aria-hidden="true"></i>
                              </span>
                          </button>

                          <div class="pf-c-select__menu" hidden="">
                            <fieldset class="pf-c-select__menu-fieldset" aria-label="Select input">
                              <label class="pf-c-check pf-c-select__menu-item pf-m-description"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-risk-active">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-risk-active"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-risk-active">

                                <span class="pf-c-check__label">Active</span>
                                <span class="pf-c-check__description">This is a description</span>
                              </label>
                              <label class="pf-c-check pf-c-select__menu-item pf-m-description"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-risk-canceled">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-risk-canceled"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-risk-canceled">

                                <span class="pf-c-check__label">Canceled</span>
                                <span class="pf-c-check__description">This is a really long description that describes the menu item. This is a really long description that describes the menu item.</span>
                              </label>
                              <label class="pf-c-check pf-c-select__menu-item"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-risk-paused">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-risk-paused"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-risk-paused">

                                <span class="pf-c-check__label">Paused</span>
                              </label>
                              <label class="pf-c-check pf-c-select__menu-item"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-risk-warning">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-risk-warning"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-risk-warning">

                                <span class="pf-c-check__label">Warning</span>
                              </label>
                              <label class="pf-c-check pf-c-select__menu-item"
                                     for="primary-detail-expanded-example-toolbar-select-checkbox-risk-restarted">
                                <input class="pf-c-check__input" type="checkbox"
                                       id="primary-detail-expanded-example-toolbar-select-checkbox-risk-restarted"
                                       name="primary-detail-expanded-example-toolbar-select-checkbox-risk-restarted">

                                <span class="pf-c-check__label">Restarted</span>
                              </label>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="pf-c-toolbar__item">
                    <button class="pf-c-button pf-m-plain" type="button" aria-label="Sort">
                      <i class="fas fa-sort-amount-down" aria-hidden="true"></i>
                    </button>
                  </div>

                  <div class="pf-c-overflow-menu" id="primary-detail-expanded-example-toolbar-overflow-menu">
                    <div class="pf-c-overflow-menu__content pf-u-display-none pf-u-display-flex-on-lg">
                      <div class="pf-c-overflow-menu__group pf-m-button-group">
                        <div class="pf-c-overflow-menu__item">
                          <button class="pf-c-button pf-m-primary" type="button">Create instance</button>
                        </div>
                      </div>
                    </div>
                    <div class="pf-c-overflow-menu__control">
                      <div class="pf-c-dropdown">
                        <button class="pf-c-button pf-c-dropdown__toggle pf-m-plain" type="button"
                                id="primary-detail-expanded-example-toolbar-overflow-menu-dropdown-toggle"
                                aria-label="Dropdown with additional options" aria-expanded="false">
                          <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
                        </button>
                        <ul class="pf-c-dropdown__menu"
                            aria-labelledby="primary-detail-expanded-example-toolbar-overflow-menu-dropdown-toggle"
                            hidden="">
                          <li>
                            <button class="pf-c-dropdown__menu-item">Action 7</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="pf-c-toolbar__item pf-m-pagination">
                    <div class="pf-c-pagination pf-m-compact">
                      <div class="pf-c-options-menu">
                        <div class="pf-c-options-menu__toggle pf-m-text pf-m-plain">
                            <span class="pf-c-options-menu__toggle-text">
                              <b>1 - 10</b>&nbsp;of&nbsp;
                              <b>37</b>
                            </span>
                          <button class="pf-c-options-menu__toggle-button"
                                  id="primary-detail-expanded-example-toolbar-top-pagination-toggle"
                                  aria-haspopup="listbox" aria-expanded="false" aria-label="Items per page">
                              <span class="pf-c-options-menu__toggle-button-icon">
                                <i class="fas fa-caret-down" aria-hidden="true"></i>
                              </span>
                          </button>
                        </div>
                        <ul class="pf-c-options-menu__menu"
                            aria-labelledby="primary-detail-expanded-example-toolbar-top-pagination-toggle" hidden="">
                          <li>
                            <button class="pf-c-options-menu__menu-item" type="button">5 per page</button>
                          </li>
                          <li>
                            <button class="pf-c-options-menu__menu-item" type="button">
                              10 per page
                              <div class="pf-c-options-menu__menu-item-icon">
                                <i class="fas fa-check" aria-hidden="true"></i>
                              </div>
                            </button>
                          </li>
                          <li>
                            <button class="pf-c-options-menu__menu-item" type="button">20 per page</button>
                          </li>
                        </ul>
                      </div>
                      <nav class="pf-c-pagination__nav" aria-label="Toolbar top pagination">
                        <div class="pf-c-pagination__nav-control pf-m-prev">
                          <button class="pf-c-button pf-m-plain" type="button" disabled=""
                                  aria-label="Go to previous page">
                            <i class="fas fa-angle-left" aria-hidden="true"></i>
                          </button>
                        </div>
                        <div class="pf-c-pagination__nav-control pf-m-next">
                          <button class="pf-c-button pf-m-plain" type="button" aria-label="Go to next page">
                            <i class="fas fa-angle-right" aria-hidden="true"></i>
                          </button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>

                <div class="pf-c-toolbar__expandable-content pf-m-hidden"
                     id="primary-detail-expanded-example-toolbar-expandable-content" hidden=""></div>
              </div>
            </div>
          </div>
          <div class="pf-l-grid__item pf-m-6-col">6 col</div>
          <div class="pf-l-grid__item pf-m-12-col">12 col</div>
        </div>

      </section>


    </main>
  </div>
</template>

<style>
</style>