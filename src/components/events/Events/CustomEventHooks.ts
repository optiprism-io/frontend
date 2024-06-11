import {computed, ref} from 'vue'

import {useLexiconStore} from '@/stores/lexicon'

import type {Event, EventFilter} from '@/stores/eventSegmentation/events'
import type {EventRef} from '@/types/events'

export default function useCustomEvent(){
    const lexiconStore = useLexiconStore()
    const hoveredCustomEventId = ref<number | null>()

    const editedEvent = computed(() => {
        if (hoveredCustomEventId.value) {
            return lexiconStore.findCustomEventById(hoveredCustomEventId.value)
        } else {
            return null
        }
    })

    const hoveredCustomEventDescription = computed(() => {
        if (editedEvent.value && editedEvent.value.events) {
            return editedEvent.value.events.map(item => {
                const event: Event = {
                    ref: {
                        type: item.eventType,
                        name: item.eventName || '',
                    },
                    filters: item.filters ? item.filters.map(filter => {
                        return <EventFilter>{
                            propRef: {
                                type: filter.propertyType,
                                name: filter?.propertyName || '',
                            },
                            opId: filter.operation,
                            values: filter.value || [],
                            valuesList: []
                        }
                    }) : [],
                    breakdowns: [],
                    queries: [],
                }

                return event
            })
        } else {
            return null
        }
    })

    const onHoverEvent = (payload: EventRef) => {
        if (payload.type === 'custom') {
            hoveredCustomEventId.value = Number(payload.id)
        } else {
            hoveredCustomEventId.value = null
        }
    }

    return {
        editedEvent,
        hoveredCustomEventDescription,
        hoveredCustomEventId,
        onHoverEvent
    }
}