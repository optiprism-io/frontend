<template>
    <input
        class="pf-c-form-control"
        :value="modelValue"
        :type="props.type"
        @input="updateValue"
        @blur="blur"
    >
</template>

<script setup lang="ts">
const emit = defineEmits(["update:modelValue", "blur"]);

interface Props {
    modelValue?: number | string
    type?: string
    placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    type: "text",
    placeholder: '',
});

const updateValue = (e: Event) => {
    const target = e.target as HTMLInputElement;

    emit("update:modelValue", target.value);
};

const blur = (e: any) => emit("blur", e);
</script>

<style lang="scss"></style>
