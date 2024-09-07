<template>
  <div class="pf-v5-l-flex">
    <div class="pf-v5-c-card__title pf-v5-u-mr-0">
      <slot />
    </div>
    <div class="pf-v5-l-flex__item">
      <slot name="extra" />
    </div>
    <template v-if="$slots.right">
      <div class="pf-v5-l-flex__item pf-v5-u-ml-auto">
        <slot name="right" />
      </div>
    </template>
  </div>
</template>
