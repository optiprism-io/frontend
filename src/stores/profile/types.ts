import { ErrorResponse, UpdateProfilePasswordRequest } from '@/api'

export interface ProfileErrors {
  updateName: {
    name?: string
  }
  updateEmail: {
    email?: string
    password?: string
  }
  updatePassword: {
    password?: string
    newPassword?: string
    confirmPassword?: string
  }
}

export interface ProfileEdit {
  name: boolean
  email: boolean
  password: boolean
}

export interface UpdateProfilePasswordRequestExt extends UpdateProfilePasswordRequest {
  confirmPassword: string
}

export function isErrorResponseError(err: any): err is ErrorResponse {
  return 'error' in err
}
