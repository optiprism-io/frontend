<script lang="ts">
import { defineComponent, h } from 'vue';
import type { VNode } from 'vue';

import GridContainer from '@/components/grid/GridContainer.vue';
import GridItem from '@/components/grid/GridItem.vue';

export default defineComponent({
    components: {
        GridContainer,
        GridItem,
    },
    props: {
        colLg: {
            type: [String, Number],
            default: 6,
        },
    },
    setup(props, { slots }) {
        const children = slots.default?.() ?? [];
        const renderGridItem = (child: VNode) => h(GridItem, { colLg: props.colLg }, () => child);

        return () => [
            h('div', { class: 'pf-v5-u-font-size-2xl pf-v5-u-mb-md' }, slots.title?.() ?? ''),
            h(GridContainer, {}, () => [
                ...children.map(renderGridItem),
                h(GridItem, { col: 12, colLg: 12 }, slots.main)
            ])
        ];
    }
});
</script>
