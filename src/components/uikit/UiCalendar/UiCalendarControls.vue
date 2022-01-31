<template>
    <div class="pf-u-pt-md">
        <UiTabs
            class="pf-m-inset-md"
            :items="itemsTabs"
            :box="true"
            @on-select="onSelectTab"
        />
        <div
            v-if="activeTab === 'last'"
            class="pf-u-p-md"
        >
            <div class="pf-u-display-flex pf-u-align-items-center">
                <span class="ws-example-flex-item">Last</span>
                <UiInput
                    class="pf-u-w-50 pf-u-mx-md"
                    :value="props.lastCount"
                    type="number"
                    :placeholder="'Enter a value'"
                    @input="onSelectLastCount"
                />
                <span class="ws-example-flex-item">{{ typeLastCount }}</span>
            </div>
        </div>
        <div
            v-if="activeTab === 'since'"
            class="pf-u-p-md"
        >
            // TODO
        </div>
        <div
            v-if="activeTab === 'between'"
            class="pf-u-p-md"
        >
            // TODO
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import UiTabs from "@/components/uikit/UiTabs.vue";
import UiInput from "@/components/uikit/UiInput.vue";

interface Props {
    groupBy?: string,
    lastCount?: number,
    activeTab: string,
}

const emit = defineEmits<{
    (e: "on-select-tab", payload: string): void;
    (e: "on-select-last-count", payload: number): void;
}>();


const props = withDefaults(defineProps<Props>(), {
    groupBy: 'day',
    lastCount: 7,
});

const tabsMap = [
    {
        name: "Last",
        value: "last",
    },
    {
        name: "Since",
        value: "since",
    },
    {
        name: "Between",
        value: "between",
    }
]

const typeLastCount = computed(() => {
    switch(props.groupBy) {
        case 'week':
            return 'weeks';
        case 'month':
            return 'month';
        default:
            return 'days';
    }
})

const itemsTabs = computed(() => {
    return tabsMap.map(item => {
        return {
            ...item,
            active: props.activeTab === item.value,
        }
    });
});

const onSelectTab = (value: string) => {
    emit('on-select-tab', value);
}

const onSelectLastCount = (e: Event) => {
    const target = e.target as HTMLInputElement;

    emit('on-select-last-count', Number(target.value));
}
</script>

<style lang="scss"></style>
