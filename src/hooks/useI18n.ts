import { inject } from 'vue';
import { $T, $TKeyExists } from '@/utils/i18n';

export default function useI18n() {
    return {
        t: inject('$t') as $T,
        keyExists: inject('$tkeyExists') as $TKeyExists,
    };
}