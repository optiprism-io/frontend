import {
  custom,
  email,
  forward,
  minLength,
  minValue,
  number,
  object,
  string,
  toTrimmed,
} from 'valibot'

const enum Error {
  EmptyField = 'This field is required',
  NotMatchPassword = 'The passwords do not match',
}

export const notEmptyString = string([toTrimmed(), minLength(1, Error.EmptyField)])

export const notEmptyEmail = string([toTrimmed(), minLength(1, Error.EmptyField), email()])

export const moreThanZeroNumber = number([minValue(1)])

export const confirmPassword = object(
  {
    newPassword: string([toTrimmed(), minLength(1, Error.EmptyField)]),
    confirmPassword: string([toTrimmed(), minLength(1, Error.EmptyField)]),
  },
  [
    forward(
      custom(input => input.newPassword === input.confirmPassword, Error.NotMatchPassword),
      ['confirmPassword']
    ),
  ]
)
