import { EventType } from '@/api'
import {useLexiconStore} from '@/stores/lexicon';

import type { Event } from '@/api';
import type {EventRef} from '@/types/events';

export const useEventName = (): (ref: EventRef) => string => {
    const lexiconStore = useLexiconStore();
    return (ref: EventRef): string => {
        const event = ref?.id ? lexiconStore.findEventById(ref.id) : ref?.name ? lexiconStore.findEventByName(ref.name) : {} as Event;
        switch (ref.type) {
            case EventType.Regular:
                return ref?.name || event?.name || '';
            case EventType.Custom:
                return lexiconStore.findCustomEventByName(ref.name).name;
        }
        throw new Error('unhandled');
    };
}
