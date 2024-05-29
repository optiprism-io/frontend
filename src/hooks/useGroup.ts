import { computed } from 'vue'
import { useLexiconStore } from '@/stores/lexicon'

export const useGroup = () => {
    const lexiconStore = useLexiconStore()

    const selectGroups =  computed(() => {
        return lexiconStore.groups.map((item, i) => {
            return {
                key: i,
                nameDisplay: item.name,
                value: item.id,
                }
            });
    })

    return {
        selectGroups
    }
}