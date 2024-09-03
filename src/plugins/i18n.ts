import { createI18n } from 'vue-i18n'

import EN from '@/lang/en.json'
import RU from '@/lang/ru.json'

export enum Language {
  EN = 'EN',
  RU = 'RU',
}

/* TODO: uncomment "typeof EN" line when all keys for Russian language are written (it is for typescript checking) */
// type MessageSchema = typeof EN
type MessageSchema = typeof RU

export const i18n = createI18n<[MessageSchema], Language, false>({
  legacy: false,
  locale: Language.EN,
  fallbackLocale: Language.EN,
  messages: {
    [Language.EN]: EN,
    [Language.RU]: RU,
  },
  pluralRules: {
    [Language.RU]: slavicLangPluralRule,
  },
})

/* https://vue-i18n.intlify.dev/guide/essentials/pluralization.html#custom-pluralization */
function slavicLangPluralRule(choice: number, choicesLength: number): 0 | 1 | 2 | 3 {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}
