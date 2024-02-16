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
        <img class="pf-c-brand" src="@/assets/img/logo-black.svg" alt="OptiPrism" />
      </header>
      <main class="pf-c-login__main">
        <header class="pf-c-login__main-header">
          <h1 class="pf-c-title pf-m-3xl">
            {{ $t('login.text') }}
          </h1>
        </header>
        <div class="pf-c-login__main-body">
          <UiForm class="login-form" :error-main="errorMain" @submit="actionForm">
            <UiFormGroup
              :label="'Email'"
              :error="errorFields?.email"
              :for="'login-email'"
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
              :for="'login-password'"
              :required="true"
            >
              <UiInputGroup>
                <UiInput
                  v-model="password"
                  name="login-password"
                  :type="showPassword ? 'text' : 'password'"
                  :invalid="Boolean(errorFields?.password)"
                  @input="e => onInput(e, 'password')"
                />
                <UiButton class="pf-m-control" @click="showPassword = !showPassword">
                  <UiIcon :icon="['fas', showPassword ? 'fa-eye-slash' : 'fa-eye']" />
                </UiButton>
              </UiInputGroup>
            </UiFormGroup>
            <UiFormGroup>
              <UiCheckbox v-model="keepLogged" :label="$t('login.keep')" class="pf-u-mb-md" />
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
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { pagesMap } from '@/router'
import UiInput from '@/components/uikit/UiInput.vue'
import UiCheckbox from '@/components/uikit/UiCheckbox.vue'
import UiForm from '@/components/uikit/UiForm.vue'
import UiFormGroup from '@/components/uikit/UiFormGroup.vue'
import UiIcon from '@/components/uikit/UiIcon.vue'
import UiInputGroup from '@/components/uikit/UiInputGroup.vue'
import { safeParse } from 'valibot'
import { notEmptyEmail, notEmptyString } from '@/utils/validationSchemes'
import { merge } from 'lodash'
import { useProjectsStore } from '@/stores/projects/projects'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const projectStore = useProjectsStore()

const email = ref('')
const password = ref('')
const keepLogged = ref(true)
const showPassword = ref(false)
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
    if (authStore.accessToken) {
      await projectStore.init()
    }

    if (!projectStore.projectId) {
      await router.push({ name: pagesMap.createProject })
      return
    }

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
  const eCheck = safeParse(notEmptyEmail, email.value)
  const pCheck = safeParse(notEmptyString, password.value)

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

<style lang="scss">
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
