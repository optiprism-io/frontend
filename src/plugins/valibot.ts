import {
  check,
  email,
  forward,
  minLength,
  minValue,
  number,
  object,
  pipe,
  string,
  trim,
} from 'valibot'

const enum Error {
  EmptyField = 'This field is required',
  NotMatchPassword = 'The passwords do not match',
}

export const notEmptyString = pipe(string(), trim(), minLength(1, Error.EmptyField))
export const notEmptyEmail = pipe(notEmptyString, email())
export const moreThanZeroNumber = pipe(number(), minValue(1))

/* https://valibot.dev/guides/methods/ */
export const confirmPassword = pipe(
  object({
    newPassword: notEmptyString,
    confirmPassword: notEmptyString,
  }),
  forward(
    check(input => input.newPassword === input.confirmPassword, Error.NotMatchPassword),
    ['confirmPassword']
  )
)

export const confirmEmail = pipe(
  object({
    newEmail: notEmptyString,
    confirmEmail: notEmptyString,
  }),
  forward(
    check(input => input.newEmail === input.confirmEmail),
    ['confirmEmail']
  )
)
