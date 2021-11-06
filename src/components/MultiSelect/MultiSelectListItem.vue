<template>
  <li class="pf-c-menu__list-item">
    <a class="pf-c-menu__item" @click="click">
      <span class="pf-c-menu__item-main">
        <span class="pf-c-menu__item-icon">
          <input
              class="pf-c-check__input"
              type="checkbox"
              v-model="selected"
          />
        </span>
        <span class="pf-c-menu__item-text">{{ text }}</span>
      </span>
    </a>
  </li>
</template>

<script lang="ts" setup>


const props = defineProps<{
  item: any;
  selected: boolean;
  text: string;
}>()

const emit = defineEmits<{
  (e: 'select', item: any): void
  (e: 'deselect', item: any): void
}>()

const click = () => {
  if (props.selected) {
    emit('deselect', props.item);
  } else {
    emit('select', props.item);
  }
}
</script>