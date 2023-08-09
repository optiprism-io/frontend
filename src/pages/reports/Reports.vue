<template>
    <section class="pf-c-page__main-section reports">
        <UiTabs
            class="pf-u-mb-md"
            :items="items"
            @on-select="onSelectTab"
        />
        <div class="pf-u-mb-sm pf-u-display-flex pf-u-justify-content-space-between pf-u-align-items-center">
            <UiSelect
                v-if="!editableNameReport"
                class="reports__select pf-u-mr-md"
                :items="itemsReports"
                :text-button="reportSelectText"
                :is-text-select="true"
                :selections="[Number(reportsStore.reportId)]"
                :is-toggle="false"
                :w-100="true"
                @on-select="onSelectReport"
            >
                <template
                    v-if="reportsStore.loading"
                    #action
                >
                    <UiSpinner />
                </template>
            </UiSelect>
            <UiInlineEdit
                class="reports__name pf-u-mr-md"
                :value="reportName"
                :hide-text="true"
                @on-input="setNameReport"
                @on-edit="onEditNameReport"
            />
            <UiButton
                class="pf-m-link reports__nav-item reports__nav-item_new"
                :before-icon="'fas fa-plus'"
                @click="setNew"
            >
                {{ $t('reports.createReport') }}
            </UiButton>
            <UiButton
                class="pf-m-link pf-m-danger"
                :before-icon="'fas fa-trash'"
                @click="onDeleteReport"
            >
                {{ $t('reports.delete') }}
            </UiButton>
            <UiSwitch
                class="pf-u-ml-auto pf-u-mr-md"
                :value="commonStore.syncReports"
                :label="$t('reports.sync')"
                @input="(value: boolean) => commonStore.syncReports = value"
            />
        </div>
        <div
            v-if="reportsStore.loading"
            class="pf-u-h-66vh pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center"
        >
            <UiSpinner />
        </div>
        <router-view v-else />
    </section>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pagesMap } from '@/router'
import usei18n from '@/hooks/useI18n'
import { ReportType } from '@/api'
import { reportToStores } from '@/utils/reportsMappings'

import useConfirm from '@/hooks/useConfirm'
import { useEventsStore } from '@/stores/eventSegmentation/events'
import { useReportsStore } from '@/stores/reports/reports'
import { useCommonStore } from '@/stores/common'
import { useFilterGroupsStore } from '@/stores/reports/filters'
import { useSegmentsStore } from '@/stores/reports/segments'
import { useBreakdownsStore } from '@/stores/reports/breakdowns'
import { useStepsStore } from '@/stores/funnels/steps'
import { useLexiconStore } from '@/stores/lexicon';

import UiSelect from '@/components/uikit/UiSelect.vue'
import UiSwitch from '@/components/uikit/UiSwitch.vue'
import UiInlineEdit from '@/components/uikit/UiInlineEdit.vue'
import UiSpinner from '@/components/uikit/UiSpinner.vue'

const { t } = usei18n()
const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const reportsStore = useReportsStore()
const commonStore = useCommonStore()
const filterGroupsStore = useFilterGroupsStore()
const segmentsStore = useSegmentsStore()
const breakdownsStore = useBreakdownsStore()
const stepsStore = useStepsStore()
const lexiconStore = useLexiconStore();
const { confirm } = useConfirm()

const editableNameReport = ref(false);
const reportName = ref('');

const reportsId = computed((): number[] => reportsStore.reportsId);

const items = computed(() => {
    const mapTabs = [
        {
            name: t('events.event_segmentation'),
            value: pagesMap.reportsEventSegmentation.name,
            link: {
                name: pagesMap.reportsEventSegmentation.name,
            },
        },
        {
            name: t('funnels.funnels'),
            value: 'reports_funnels',
            link: {
                name: 'reports_funnels'
            },
        }
    ];

    return mapTabs.map(item => {
        return {
            ...item,
            active: route.name === item.value,
        }
    });
})

const reportSelectText = computed(() => {
    return reportsStore.activeReport ? reportsStore.activeReport.name : t('reports.selectReport')
})

const reportType = computed(() => pagesMap.reportsEventSegmentation.name === route.name ?
    ReportType.EventSegmentation : ReportType.Funnel)

const itemsReports = computed(() => {
    return reportsStore.list.map(item => {
        const id = Number(item.id)
        return {
            value: id,
            key: id,
            nameDisplay: item.name || '',
        }
    })
})


const untitledReportsList = computed(() => {
    return reportsStore.list.filter(item => (`${item.name.split(' ')[0]}` + ' ' + `${item.name.split(' ')[1]}`) === t('reports.untitledReport'));
});
const untitledReportName = computed(() => {
    return `${t('reports.untitledReport')} #${untitledReportsList.value.length + 1}`;
});


const onEditNameReport = (payload: boolean) => {
    editableNameReport.value = payload;
};

const onDeleteReport = async () => {
    try {
        await confirm(t('reports.deleteConfirm', { name: `<b>${reportsStore?.activeReport?.name}</b>` || '' }), {
            applyButton: t('common.apply'),
            cancelButton: t('common.cancel'),
            title: t('reports.delete'),
            applyButtonClass: 'pf-m-danger',
        })

        reportsStore.deleteReport(reportsStore.reportId)
        setNew();
        reportsStore.getList()
    } catch(error) {
        reportsStore.loading = false
    }
}

const onSaveReport = async () => {
    if (reportsStore.reportId) {
        await reportsStore.editReport(reportName.value, reportType.value)
    } else {
        await reportsStore.createReport(reportName.value || untitledReportName.value, reportType.value)

        router.push({
            params: {
                id: reportsStore.reportId,
            }
        })
    }
    await reportsStore.getList()
    reportsStore.updateDump(reportType.value)
}

const setNameReport = (payload: string) => {
    reportName.value = payload
    onSaveReport();
}

const onChange = async () => {
    reportsStore.loading = true;
    await onSaveReport();
    await reportsStore.getList();
    reportsStore.loading = false;
};

const setNew = async () => {
    reportsStore.reportId = 0;
    reportName.value = untitledReportName.value;
    eventsStore.$reset();
    filterGroupsStore.$reset();
    segmentsStore.$reset();
    breakdownsStore.$reset();
    stepsStore.$reset();
    onChange();
}

const onSelectTab = () => {
    if (reportsStore.reportId) {
        setNew();
    }
}

const updateReport = async (id: number) => {
    try {
        await reportToStores(Number(id))
    } catch(e) {
        throw new Error('cannot update report');
    }
    reportName.value = reportsStore.activeReport?.name ?? t('reports.untitledReport')
    reportsStore.updateDump(reportType.value)
}

const onSelectReport = async (id: number) => {
    await updateReport(id);
    router.push({ params: { id } });
}

const initReportPage = async () => {
    const reportId =
        (reportsId.value.includes(Number(route.params?.id)) ? route.params?.id : reportsId.value[0]) || null;

    if (reportId) {
        await onSelectReport(Number(reportId));
    } else {
        await setNew();
    }

    reportsStore.loading = false;
};

const initEventsAndProperties = async () => {
    await Promise.all([
        lexiconStore.getEvents(),
        lexiconStore.getEventProperties(),
        lexiconStore.getUserProperties(),
    ]);
};

onMounted(async () => {
    reportsStore.loading = true
    eventsStore.initPeriod();
    await initEventsAndProperties();
    await reportsStore.getList();
    initReportPage();
})
</script>

<style lang="scss">
.reports {
    &__name {
        .pf-c-inline-edit__value {
            font-size: 20px;
        }
    }
    &__select {
        width: 220px;
    }
    &__nav {
        min-height: 34px;
        &-item {
            &_new {
                margin-left: -12px;
            }
        }
    }
}
</style>