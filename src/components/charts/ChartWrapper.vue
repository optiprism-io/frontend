<template>
    <div class="chart-wrapper">
        <div
            ref="chart"
            class="chart-wrapper__container"
        />
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Line } from '@antv/g2plot';
import defaultOptions from "@/configs/chartOptions";
import mergeObjects from "@/helpers/mergeObjects";

const mapCharts = {
    line: Line,
};

const props = withDefaults(
    defineProps<{
        options: any;
        type: 'line';
    }>(),
    {
        options: {},
    }
);

const chart = ref(null);
const chartLib = ref();

const deleteReactivity = (data: any) => {
    return JSON.parse(JSON.stringify(data));
};

const updateOptions = () => {
    const lineChartContainer: any = chart.value;
    const options = mergeObjects(defaultOptions, deleteReactivity(props.options));

    if (chartLib.value) {
        chartLib.value.update(options);
    } else {
        chartLib.value = new mapCharts[props.type](lineChartContainer, options);
        chartLib.value.render();
    }
};

watch(
    () => props.options,
    () => {
        updateOptions();
    }
);

onMounted(() => {
    updateOptions();
});
</script>

<style lang="scss"></style>