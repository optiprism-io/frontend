const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3MDU2NTYzNzQsImFjY291bnRJZCI6MSwib3JnYW5pemF0aW9uSWQiOjEsInByb2plY3RJZCI6MX0.oeOoD7lowPx7unB9qAK4zNu6S_P9eyezZ6S_cTB5Sy2mzFT2HYyUoHXbJD3bT99vrNOakSRh3Ws_0eEkDTlFmQ'
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Im5pa28ga3VzaCIsImlhdCI6MTUxNjIzOTAyMn0.FzpmXmStgiYEO15ZbwwPafVRQSOCO_xidYjrjRvVIbQ'
const csrfToken = 'CIwNZNlR4XbisJF39I8yWnWX9wX4WFoz'

export const Tokens = {
  accessToken,
  refreshToken,
  csrfToken,
}

export const EMPTY_SUCCESS_RES = 'done'
export const EMPTY_HEADER_RESPONSE = { some: 'header' }

export enum Stub {
  ERROR = 'error',
  TOAST = 'toast',
}