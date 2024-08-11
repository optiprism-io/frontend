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
  NotMatchEmail = 'The emails do not match',
  InvalidEmail = 'Invalid email',
}

export const notEmptyString = pipe(string(), trim(), minLength(1, Error.EmptyField))
export const notEmptyEmail = pipe(notEmptyString, email(Error.InvalidEmail))
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
    newEmail: notEmptyEmail,
    confirmEmail: notEmptyEmail,
  }),
  forward(
    check(input => input.newEmail === input.confirmEmail, Error.NotMatchEmail),
    ['confirmEmail']
  )
)
