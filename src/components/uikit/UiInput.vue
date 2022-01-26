<template>
    <input
        class="pf-c-form-control"
        :value="props.value"
        :type="props.type"
        @input="input"
        @blur="blur"
    >
</template>

<script setup lang="ts">
const emit = defineEmits(["update:modelValue", "blur"]);

interface Props {
    value?: number | string;
    type?: string;
}

const props = withDefaults(defineProps<Props>(), {
    value: "",
    type: "text"
});

const input = (e: Event) => {
    const target = e.target as HTMLInputElement;

    emit("update:modelValue", target.value);
};

const blur = (e: any) => emit("blur", e);
</script>

<style lang="scss"></style>
