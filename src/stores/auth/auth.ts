import { defineStore } from 'pinia'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'

import { apiClient } from '@/api/apiClient'
import { axiosInstance } from '@/plugins/axios'
import { LocalStorageAccessor } from '@/utils/localStorageAccessor'
import { parseJwt } from '@/utils/parseJwt'

import type { LoginRequest, TokensResponse } from '@/api'
import type { DecodedJwt} from '@/utils/parseJwt';

const TOKEN_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const KEEP_LOGGED = 'keepLogged'
const HEADER_KEY = 'authorization'
const EXPIRES_DAYS = 30

export interface AuthState {
  accessToken: string | null
  refreshToken: LocalStorageAccessor,
  refreshing: boolean,
}

interface LoginPayload extends LoginRequest {
    keepLogged?: boolean
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: null,
        refreshToken: new LocalStorageAccessor(REFRESH_KEY),
        refreshing: false,
    }),
    getters: {
        isAuthenticated(): boolean {
            return !!this.accessToken && !!localStorage.getItem(REFRESH_KEY)
        },
        decodedAccessToken(): DecodedJwt | null {
            return parseJwt(this.accessToken)
        },
    },
    actions: {
        async login(args: LoginPayload): Promise<void> {
            try {
                const res = await apiClient.auth.basicLogin({ email: args.email, password: args.password })
                this.setToken(res.data, args.keepLogged)
            } catch (e) {
                return Promise.reject(e)
            }
        },
        authAccess(): void {
            const accessToken = localStorage.getItem('keepLogged') ? getCookie(TOKEN_KEY) : sessionStorage.getItem(TOKEN_KEY);
            const refreshToken = localStorage.getItem(REFRESH_KEY) || '';
            if (accessToken) {
                this.setToken({
                    accessToken,
                    refreshToken,
                }, !!localStorage.getItem('keepLogged'))
            }
        },
        async onRefreshToken(): Promise<void> {
            const refreshToken = localStorage.getItem(REFRESH_KEY) || '';
            if (refreshToken && !this.refreshing) {
                this.refreshing = true;
                try {
                    const res = await apiClient.auth.refreshToken({ refreshToken })
                    this.reset();
                    this.setToken(res?.data, !!localStorage.getItem('keepLogged'))
                } catch (error) {
                    this.reset();
                    throw new Error(JSON.stringify(error))
                }
                this.refreshing = false;
            }
        },
        setToken(token: TokensResponse, keepLogged?: boolean): void {
            if (!token.accessToken) throw new Error('accessToken is empty')
            if (!token.refreshToken) throw new Error('refreshToken is empty')

            if (keepLogged) {
                setCookie(TOKEN_KEY, token.accessToken, {
                  expires: EXPIRES_DAYS,
                  sameSite: 'strict',
                  path: '/'
                })
                localStorage.setItem(KEEP_LOGGED, 'true')
            } else {
                sessionStorage.setItem(TOKEN_KEY, token.accessToken)
            }
            axiosInstance.defaults.headers.common[HEADER_KEY] = `Bearer ${token.accessToken}`

            this.accessToken = token.accessToken
            this.refreshToken.value = token.refreshToken
        },
        reset(): void {
            localStorage.removeItem(KEEP_LOGGED)
            sessionStorage.removeItem(TOKEN_KEY)
            removeCookie(TOKEN_KEY, { sameSite: 'strict', path: '/' })
            this.accessToken = null
            this.refreshToken.value = null
        },
        logout(): void {
            this.reset()
            window.open('/login', '_self')
        }
    }
})
