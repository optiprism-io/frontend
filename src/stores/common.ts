import {defineStore} from 'pinia'

export const PropertyTypeEnum = {
    UserProperty: 'userProperty',
    EventProperty: 'eventProperty',
} as const;

export type PropertyTypeEnum = typeof PropertyTypeEnum[keyof typeof PropertyTypeEnum];

export type Common = {
    showCreateCustomEvent: boolean
    showEventManagementPopup: boolean
    editEventManagementPopupId: number | null
    showEventPropertyPopup: boolean
    editEventPropertyPopupId: number | null
    editEventPropertyPopupType: PropertyTypeEnum
    syncReports: boolean
};

export const useCommonStore = defineStore('common', {
    state: (): Common => ({
        showCreateCustomEvent: false,
        showEventManagementPopup: false,
        editEventManagementPopupId: null,
        showEventPropertyPopup: false,
        editEventPropertyPopupId: null,
        editEventPropertyPopupType: PropertyTypeEnum.EventProperty,
        syncReports: false,
    }),
    actions: {
        updateEditEventManagementPopupId(payload: number | null) {
            this.editEventManagementPopupId = payload
        },
        toggleEventManagementPopup(payload: boolean) {
            this.showEventManagementPopup = payload
        },
        togglePopupCreateCustomEvent(payload: boolean) {
            this.showCreateCustomEvent = payload
        },
    },
});