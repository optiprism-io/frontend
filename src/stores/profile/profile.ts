import { defineStore } from 'pinia'
import {
  UpdateProfileEmailRequest,
  UpdateProfileNameRequest,
  UpdateProfilePasswordRequest,
} from '@/api'
import profileService from '@/api/services/profile.service'
import { useAuthStore } from '@/stores/auth/auth'
import { safeParse } from 'valibot'
import {
  confirmPasswordScheme,
  notEmptyEmailScheme,
  notEmptyStringScheme,
} from '@/stores/profile/validationSchemes'
import {
  isErrorResponseError,
  ProfileEdit,
  ProfileErrors,
  UpdateProfilePasswordRequestExt,
} from '@/stores/profile/types'

interface ProfileState {
  profile: {
    id: number | null
    name: string
    email: string
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
        const { data } = await profileService.getProfile()
        this.profile = data
      } catch (error) {
        throw new Error('error get profile')
      } finally {
        this.isLoading = false
      }
    },

    async saveEditName({ name }: UpdateProfileNameRequest) {
      const nCheck = safeParse(notEmptyStringScheme, name)
      if (!nCheck.success) {
        this.errors.updateName.name = nCheck.error
        return
      }

      try {
        await this.__updateName({ name })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields?.name) {
            this.errors.updateName.name = new Error(err.fields.name)
            return
          }

          if (err?.message) throw new Error(err.message)
        }
        throw new Error('error update name')
      }

      this.resetEditName()
    },

    async saveEditEmail({ email, password }: UpdateProfileEmailRequest) {
      const eCheck = safeParse(notEmptyEmailScheme, email)
      const pCheck = safeParse(notEmptyStringScheme, password)
      if (!eCheck.success || !pCheck.success) {
        this.errors.updateEmail.email = eCheck.error
        this.errors.updateEmail.password = pCheck.error
        return
      }

      try {
        await this.__updateEmail({ email, password })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields) {
            if (err.fields.email) this.errors.updateEmail.email = new Error(err.fields.email)
            if (err.fields.password)
              this.errors.updateEmail.password = new Error(err.fields.password)
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
      const curPCheck = safeParse(notEmptyStringScheme, password)
      const newPCheck = safeParse(notEmptyStringScheme, newPassword)
      const conPCheck = safeParse(confirmPasswordScheme, {
        newPassword,
        confirmPassword,
      })

      if (!curPCheck.success || !newPCheck.success || !conPCheck.success) {
        this.errors.updatePassword.password = curPCheck.error
        this.errors.updatePassword.newPassword = newPCheck.error
        this.errors.updatePassword.confirmPassword = conPCheck.error
        return
      }

      try {
        await this.__updatePassword({ password, newPassword })
      } catch (error) {
        if (isErrorResponseError(error)) {
          const err = error.error

          if (err?.fields) {
            if (err.fields?.password)
              this.errors.updatePassword.password = new Error(err.fields.password)
            if (err.fields?.newPassword)
              this.errors.updatePassword.newPassword = new Error(err.fields.newPassword)
            return
          }

          if (err?.message) throw new Error(err.message)
        }
        throw new Error('error update password')
      }

      this.resetEditPassword()
    },

    async __updateName({ name }: UpdateProfileNameRequest) {
      await profileService.updateName({ name })
      this.profile = {
        ...this.profile,
        name,
      }
    },

    async __updateEmail({ email, password }: UpdateProfileEmailRequest) {
      const authStore = useAuthStore()

      const { data } = await profileService.updateEmail({
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

      const { data } = await profileService.updatePassword({
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
