<template>
  <div class="login pf-c-background-image">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="pf-c-background-image__filter"
      width="0"
      height="0"
    >
      <filter id="image_overlay">
        <feColorMatrix type="matrix" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 1 0" />
        <feComponentTransfer color-interpolation-filters="sRGB" result="duotone">
          <feFuncR type="table" tableValues="0.086274509803922 0.43921568627451" />
          <feFuncG type="table" tableValues="0.086274509803922 0.43921568627451" />
          <feFuncB type="table" tableValues="0.086274509803922 0.43921568627451" />
          <feFuncA type="table" tableValues="0 1" />
        </feComponentTransfer>
      </filter>
    </svg>
  </div>
  <div class="pf-c-login">
    <div class="pf-c-login__container">
      <header class="pf-c-login__header">
        <img
          class="pf-c-brand"
          src="@/assets/img/logo-black.svg"
          alt="OptiPrism"
        >
      </header>
      <main class="pf-c-login__main">
        <header class="pf-c-login__main-header">
          <h1 class="pf-c-title pf-m-3xl">
            {{ $t('login.text') }}
          </h1>
        </header>
        <div class="pf-c-login__main-body">
          <UiForm
            class="login-form"
            :error-main="errorMain"
            @submit="actionForm"
          >
            <UiFormGroup
              label="Email"
              :error="errorFields?.email"
              for="login-email"
              :required="true"
            >
              <UiInput
                v-model="email"
                name="login-email"
                :invalid="Boolean(errorFields?.email)"
                @input="e => onInput(e, 'email')"
              />
            </UiFormGroup>
            <UiFormGroup
              :label="$t('login.password')"
              :error="errorFields?.password"
              for="login-password"
              :required="true"
            >
              <InputPassword
                v-model="password"
                :invalid="Boolean(errorFields?.password)"
                @input="e => onInput(e, 'password')"
              />
            </UiFormGroup>
            <UiFormGroup>
              <UiCheckbox
                v-model="keepLogged"
                :label="$t('login.keep')"
                class="pf-u-mb-md"
              />
            </UiFormGroup>
            <UiFormGroup :action="true">
              <button class="pf-c-button pf-m-primary pf-m-block" type="submit">
                {{ $t('login.logIn') }}
              </button>
            </UiFormGroup>
          </UiForm>
        </div>
      </main>
      <footer class="pf-c-login__footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { merge } from 'lodash-es'
import { safeParse } from 'valibot'
import { useRoute, useRouter } from 'vue-router'

import InputPassword from '@/components/login/InputPassword.vue'
import UiCheckbox from '@/components/uikit/UiCheckbox.vue'
import UiForm from '@/components/uikit/UiForm.vue'
import UiFormGroup from '@/components/uikit/UiFormGroup.vue'
import UiInput from '@/components/uikit/UiInput.vue'

import { notEmptyEmail, notEmptyString } from '@/plugins/valibot'
import { pagesMap } from '@/router'
import { useAuthStore } from '@/stores/auth/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const keepLogged = ref(true)
const errorFields = ref<{ [key: string]: string }>({})
const errorMain = ref('')
const loading = ref(false)

const nextPath = computed(() => {
  const next = route.query.next
  return next && typeof next === 'string' ? next : pagesMap.dashboards.path
})

const onInput = (e: string, type: string) => {
  errorFields.value[type] = ''
  errorMain.value = ''
}

const login = async (): Promise<void | Error> => {
  loading.value = true
  errorFields.value = {}
  errorMain.value = ''

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      keepLogged: keepLogged.value,
    })

    await router.push({ path: nextPath.value })
  } catch (e: any) {
    const error = e?.response?.data?.error ?? e?.error ?? (e?.fields ? e : {})

    if (error?.fields) {
      errorFields.value = (error?.fields as { [key: string]: string }) || {}
    }
    if (error?.status === 401) {
      errorMain.value = error?.message
    } else {
      if (error?.message) {
        errorMain.value = error?.message
      }
    }
  }
  loading.value = false
}

const actionForm = () => {
  const eCheck = safeParse(notEmptyEmail, email.value, { abortEarly: true })
  const pCheck = safeParse(notEmptyString, password.value, { abortEarly: true })

  if (!eCheck.success) {
    errorFields.value = merge(errorFields.value, {
      email: eCheck.issues[0].message,
    })
  }

  if (!pCheck.success) {
    errorFields.value = merge(errorFields.value, {
      password: pCheck.issues[0].message,
    })
  }

  if (!eCheck.success || !pCheck.success) return

  login()
}
</script>

<style lang="scss" scoped>
.pf-c-login {
  img.pf-c-brand {
    @media screen and (min-width: 1200px) {
      max-width: 400px;
    }
  }
  &__main-body {
    position: relative;
  }
  &__main-error {
    &-wrap {
      margin-bottom: 0.7rem;
      min-height: 2rem;
      position: relative;
    }
  }
}

.login-form {
  &__field {
    position: relative;
  }
  &__field-info {
    position: absolute;
    bottom: -1.5rem;
    left: 0;
  }
  &__field-info-main {
    position: absolute;
    left: 0;
  }
}
</style>
