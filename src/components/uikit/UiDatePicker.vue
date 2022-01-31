<template>
    <VDropdown
        placement="bottom-start"
        :triggers="[]"
        :shown="isOpen"
        @hide="onHide"
    >
        <template v-if="$slots.action">
            <div @click="onToggle">
                <slot name="action" />
            </div>
        </template>
        <template #popper="{hide}">
            <UiCalendarControls
                v-if="props.showControls"
                :group-by="props.controlsGroupBy"
                :active-tab="activeTab"
                :last-count="lastCountLocal"
                @on-select-tab="onSelectTab"
                @on-select-last-count="onSelectLastCount"
            />
            <UiCalendar
                :multiple="true"
                :value="valueLocal"
                :count="25"
                :offset="-24"
                :from-select-only="fromSelectOnly"
                @on-change="onChange"
                @on-apply="(e) => {hide(); apply(e)}"
            />
        </template>
    </VDropdown>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getYYYYMMDD } from "@/helpers/getStringDates";
import { getLastNDaysRange, dateDiff } from "@/helpers/calendarHelper";
import UiCalendarControls from "@/components/uikit/UiCalendar/UiCalendarControls.vue";
import UiCalendar, { Value, CurrentValue } from "@/components/uikit/UiCalendar/UiCalendar.vue";

export interface ApplyPayload {
    value: CurrentValue,
    type: string,
    last: number,
}

interface Props {
    controlsGroupBy?: string
    showControls?: boolean
    value: Value
    lastCount?: number
    activeTabControls?: string
}

const props = withDefaults(defineProps<Props>(), {
    controlsGroupBy: 'day',
    showControls: true,
    activeTabControls: 'last',
    lastCount: 7,
});

const emit = defineEmits<{
    (e: "on-select", payload: string): void;
    (e: "on-apply", payload: ApplyPayload): void;
}>();

const activeTab = ref('last');
const isOpen = ref(false);
const lastCountLocal = ref(7);
const valueLocal = ref({
    from: '',
    to: '',
    multiple: false,
})

const fromSelectOnly = computed(() => {
    return props.showControls && activeTab.value === 'last';
});

const onToggle = () => {
    isOpen.value = !isOpen.value;
};

const onHide = () => {
    isOpen.value = false;
};

const onSelectTab = (type: string) => {
    activeTab.value = type;
}

const getCountWithGroup = (count: number) => {
    switch (props.controlsGroupBy) {
        case 'week':
            return count * 7;
        case 'month':
            return count * 30;
        default:
            return count;
    }
}

const onSelectLastCount = (payload: number) => {
    lastCountLocal.value = payload;

    const lastNDateRange = getLastNDaysRange(getCountWithGroup(payload));
    valueLocal.value = {
        ...valueLocal.value,
        to: getYYYYMMDD(lastNDateRange.to),
        from: getYYYYMMDD(lastNDateRange.from),
    }
};

const updateValue = () => {
    const value = {...props.value};

    if (!value.from && !value.to && fromSelectOnly.value) {

        if (activeTab.value === 'last') {
            const lastNDateRange = getLastNDaysRange(getCountWithGroup(lastCountLocal.value));
            value.to = getYYYYMMDD(lastNDateRange.to);
            value.from = getYYYYMMDD(lastNDateRange.from);
        }
    }

    valueLocal.value = value;
}

const onChange = (payload: CurrentValue): void => {
    let count = dateDiff(payload.from || '', payload.to || '');
    switch (props.controlsGroupBy) {
        case 'week':
            count = count / 7;
            break;
        case 'month':
            count = count / 30;
            break;
        default:

            break;
    }

    lastCountLocal.value =  Number(count.toFixed(0));
}

const apply = (payload: CurrentValue): void => {
    emit('on-apply', {
        value: payload,
        type: activeTab.value,
        last: Number(lastCountLocal.value),
    });
}

onMounted(() => {
    if (props.activeTabControls) {
        activeTab.value = props.activeTabControls;
    }

    if (props.lastCount) {
        lastCountLocal.value = props.lastCount;
    }

    updateValue();
});

watch(() => props.lastCount, (value) => {
    lastCountLocal.value = value;
    updateValue();
})

watch(() => props.controlsGroupBy, () => {
    updateValue();
})
</script>

<style lang="scss"></style>