import { defineStore } from 'pinia'
import {
  UpdateProfileEmailRequest,
  UpdateProfileNameRequest,
  UpdateProfilePasswordRequest,
} from '@/api'
import { useAuthStore } from '@/stores/auth/auth'
import { safeParse } from 'valibot'
import {
  confirmPassword as confirmPasswordScheme,
  notEmptyEmail,
  notEmptyString,
} from '@/utils/validationSchemes'
import {
  isErrorResponseError,
  ProfileEdit,
  ProfileErrors,
  UpdateProfilePasswordRequestExt,
} from '@/stores/profile/types'
import { apiClient } from '@/api/apiClient'

interface ProfileState {
  profile: {
    id: number | null
    name: string
    email: string
    timezone: string
  }
  isLoading: boolean
  errors: ProfileErrors
  isEdit: ProfileEdit
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: {
      id: null,
      name: '',
      email: '',
      timezone: '',
    },
    isLoading: false,
    errors: {
      updateName: {
        name: undefined,
      },
      updateEmail: {
        email: undefined,
        password: undefined,
      },
      updatePassword: {
        password: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
      },
    },
    isEdit: {
      name: false,
      email: false,
      password: false,
    },
  }),

  actions: {
    async getProfile() {
      this.isLoading = true
      try {
        const { data } = await apiClient.profile.getProfile()
        this.profile = data
      } catch (error) {
        throw new Error('error get profile')
      } finally {
        this.isLoading = false
      }
    },

    async saveEditName({ name }: UpdateProfileNameRequest) {
      const nCheck = safeParse(notEmptyString, name)
      if (!nCheck.success) {
        this.errors.updateName.name = nCheck.issues[0].message
        return
      }

      try {
        await this.__updateName({ name })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields?.name) {
            this.errors.updateName.name = err.fields.name
            return
          }

          if (err?.message) throw new Error(err.message)
        }
        throw new Error('error update name')
      }

      this.resetEditName()
    },

    async saveEditEmail({ email, password }: UpdateProfileEmailRequest) {
      const eCheck = safeParse(notEmptyEmail, email)
      const pCheck = safeParse(notEmptyString, password)
      if (!eCheck.success || !pCheck.success) {
        this.errors.updateEmail.email = eCheck.issues?.[0].message
        this.errors.updateEmail.password = pCheck.issues?.[0].message
        return
      }

      try {
        await this.__updateEmail({ email, password })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields) {
            if (err.fields.email) this.errors.updateEmail.email = err.fields.email
            if (err.fields.password) this.errors.updateEmail.password = err.fields.password
            return
          }

          if (err?.message) throw new Error(err.message)
        }
        throw new Error('error update email')
      }

      this.resetEditEmail()
    },

    async saveEditPassword({
      password,
      newPassword,
      confirmPassword,
    }: UpdateProfilePasswordRequestExt) {
      const curPCheck = safeParse(notEmptyString, password)
      const newPCheck = safeParse(notEmptyString, newPassword)
      const conPCheck = safeParse(confirmPasswordScheme, {
        newPassword,
        confirmPassword,
      })

      if (!curPCheck.success || !newPCheck.success || !conPCheck.success) {
        this.errors.updatePassword.password = curPCheck.issues?.[0].message
        this.errors.updatePassword.newPassword = newPCheck.issues?.[0].message
        this.errors.updatePassword.confirmPassword = conPCheck.issues?.[0].message
        return
      }

      try {
        await this.__updatePassword({ password, newPassword })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields) {
            if (err.fields?.password) this.errors.updatePassword.password = err.fields.password
            if (err.fields?.newPassword)
              this.errors.updatePassword.newPassword = err.fields.newPassword
            return
          }

          if (err?.message) throw new Error(err.message)
        }
        throw new Error('error update password')
      }

      this.resetEditPassword()
    },

    async __updateName({ name }: UpdateProfileNameRequest) {
      await apiClient.profile.updateProfileName({ name })
      this.profile = {
        ...this.profile,
        name,
      }
    },

    async __updateEmail({ email, password }: UpdateProfileEmailRequest) {
      const authStore = useAuthStore()

      const { data } = await apiClient.profile.updateProfileEmail({
        email,
        password,
      })
      this.profile = {
        ...this.profile,
        email,
      }
      authStore.setToken(data)
    },

    async __updatePassword({ password, newPassword }: UpdateProfilePasswordRequest) {
      const authStore = useAuthStore()

      const { data } = await apiClient.profile.updateProfilePassword({
        password,
        newPassword,
      })
      authStore.setToken(data)
    },

    clearNameError() {
      this.errors.updateName.name = undefined
    },

    clearEmailError() {
      this.errors.updateEmail.email = undefined
    },

    clearCurPasswordForEmailError() {
      this.errors.updateEmail.password = undefined
    },

    clearCurPasswordError() {
      this.errors.updatePassword.password = undefined
    },

    clearNewAndConfirmPasswordError() {
      this.errors.updatePassword.newPassword = undefined
      this.errors.updatePassword.confirmPassword = undefined
    },

    resetEditName() {
      this.isEdit.name = false
      this.clearNameError()
    },

    resetEditEmail() {
      this.isEdit.email = false
      this.clearEmailError()
      this.clearCurPasswordForEmailError()
    },

    resetEditPassword() {
      this.isEdit.password = false
      this.clearCurPasswordError()
      this.clearNewAndConfirmPasswordError()
    },
  },
})
