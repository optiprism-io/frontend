<template>
    <NumericIdentifier
        v-if="type === 'numeric'"
        :index="index"
        class="common-identifier"
    />
    <AlphabetIdentifier
        v-else
        :index="index"
        class="common-identifier"
    />
</template>

<script setup lang="ts">
import NumericIdentifier from '@/components/common/identifier/NumericIdentifier.vue';
import AlphabetIdentifier from '@/components/common/identifier/AlphabetIdentifier.vue';

type Props = {
    type?: 'numeric' | 'alphabet',
    index: number,
}

withDefaults(defineProps<Props>(), {
    type: 'alphabet',
});
</script>

<style scoped lang="scss">
.common-identifier {
    width: 20px;
    text-transform: uppercase;
    text-align: center;
    color: var(--pf-global--main-color--100, black);
}
</style>
