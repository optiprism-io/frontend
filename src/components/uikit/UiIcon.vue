<template>
    <i :class="[icon]" aria-hidden="true"></i>
</template>

<script setup lang="ts">
defineProps<{
    icon: string;
}>();
</script>
