import { custom, email, forward, minLength, minValue, number, object, string, toTrimmed } from 'valibot'
import i18n from '@/utils/i18n'

export const notEmptyStringScheme = string([
  toTrimmed(),
  minLength(1, i18n.t('profile.errors.emptyField')),
])

export const notEmptyEmailScheme = string([
  toTrimmed(),
  minLength(1, i18n.t('profile.errors.emptyField')),
  email(),
])

export const moreThanZeroScheme = number([
  minValue(1)
])

export const confirmPasswordScheme = object(
  {
    newPassword: string([toTrimmed(), minLength(1, i18n.t('profile.errors.emptyField'))]),
    confirmPassword: string([toTrimmed(), minLength(1, i18n.t('profile.errors.emptyField'))]),
  },
  [
    forward(
      custom(
        input => input.newPassword === input.confirmPassword,
        i18n.t('profile.errors.notMatchPassword')
      ),
      ['confirmPassword']
    ),
  ]
)
