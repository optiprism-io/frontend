import { defineStore } from 'pinia'
import axios from 'axios'
import { LoginRequest, TokensResponse } from '@/api'
import { LocalStorageAccessor } from '@/utils/localStorageAccessor'
import { getCookie, removeCookie, setCookie } from 'typescript-cookie'
import { DecodedJwt, parseJwt } from '@/utils/parseJwt'
import { apiClient } from '@/api/apiClient'

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
            if (keepLogged) {
                setCookie(TOKEN_KEY, token?.accessToken ?? '', {
                    expires: EXPIRES_DAYS
                })
                localStorage.setItem(KEEP_LOGGED, 'true')
            } else {
                sessionStorage.setItem(TOKEN_KEY, token?.accessToken ?? '')
            }
            axios.defaults.headers.common[HEADER_KEY] = token?.accessToken ? `Bearer ${token.accessToken}` : ''
            this.accessToken = token.accessToken ?? ''
            this.refreshToken.value = token.refreshToken ?? ''
        },
        reset(): void {
            localStorage.removeItem(KEEP_LOGGED)
            sessionStorage.removeItem(TOKEN_KEY)
            removeCookie(TOKEN_KEY)
            this.accessToken = null
            this.refreshToken.value = null
        },
        logout(): void {
            this.reset()
            window.open('/login', '_self')
        }
    }
})
