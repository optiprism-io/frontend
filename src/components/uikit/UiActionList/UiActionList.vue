<template>
  <div class="pf-c-action-list parent">
    <template
      v-if="$slots.main"
    >
      <slot
        name="main"
      />
    </template>
    <slot />
  </div>
</template>
