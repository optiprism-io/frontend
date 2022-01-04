<template>
    <span
        ref="button"
        class="ui-popper-action"
        aria-describedby="tooltip"
        @mousedown="clickHandler"
    >
        <slot />
    </span>
    <teleport
        v-if="visible"
        to="body"
    >
        <div
            ref="tooltip"
            class="ui-popper"
            role="tooltip"
        >
            <slot
                v-if="slots.content"
                name="content"
            />
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { computePosition, flip, shift, offset } from "@floating-ui/dom";
import { ref, useSlots, computed, onUnmounted, onBeforeMount } from "vue";

const slots = useSlots();
const emit = defineEmits(["update:modelValue"]);

const button = ref(null);
const tooltip = ref(null);
const show = ref(false);

const hasValue = computed(() => {
    return props.modelValue !== undefined;
});
const visible = computed(() => {
    return hasValue.value ? props.modelValue : show.value;
});

interface Props {
    arrow?: boolean;
    hover?: boolean;
    trigger?: string;
    modelValue?: boolean | undefined;
    placement?:
        | "top"
        | "top-start"
        | "top-end"
        | "right"
        | "right-start"
        | "right-end"
        | "bottom"
        | "bottom-start"
        | "bottom-end"
        | "left"
        | "left-start"
        | "left-end";
}

const props = withDefaults(defineProps<Props>(), {
    placement: "bottom-start",
    trigger: "click",
    modelValue: undefined
});

const update = () => {
    const buttonElement: any = button.value;
    const tooltipElement: any = tooltip.value;

    if (buttonElement && tooltipElement) {
        computePosition(buttonElement, tooltipElement, {
            placement: props.placement,
            middleware: [offset(6), flip(), shift()]
        }).then(({ x, y }) => {
            Object.assign(tooltipElement.style, {
                left: `${x}px`,
                top: `${y}px`,
                display: "block"
            });
        });
    }
};

const setValue = (value: boolean): void => {
    if (hasValue.value) {
        emit("update:modelValue", value);
    } else {
        show.value = value;
    }
};

const open = () => {
    setValue(true);
    setTimeout(() => {
        update();
    });
};

const close = (): void => {
    setValue(false);
};

const toggle = (e: any): void => {
    if (visible.value) {
        close();
    } else {
        open();
    }
};

const clickHandler = (e: any) => {
    if (props.trigger === "click") {
        toggle(e);
    }
};

const clickOutside = (e: any) => {
    if (visible.value) {
        const buttonElement: any = button.value;
        const tooltipElement: any = tooltip.value;

        if (
            !(buttonElement === e.target || buttonElement.contains(e.target)) &&
            !(tooltipElement && (tooltipElement === e.target || tooltipElement.contains(e.target)))
        ) {
            close();
        }
    }
};

onBeforeMount(() => {
    if (props.modelValue) {
        open();
    }
    addEventListener("mouseup", clickOutside);
});

onUnmounted(() => {
    removeEventListener("scroll", update);
    removeEventListener("resize", update);
    removeEventListener("mouseup", clickOutside);
});
</script>

<style lang="scss" scoped>
.ui-popper-action {
    display: inline-block;
    background-color: initial;
    border: none;
    padding: 0;
}

.ui-popper {
    top: 0;
    left: 0;
    position: absolute;
    display: inline-block;
    display: none;
    z-index: 1000;
}
</style>
