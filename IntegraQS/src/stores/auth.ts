import { defineStore } from "pinia"

interface AuthState {
    accessToken: string | null
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        accessToken: localStorage.getItem("access_token")
    }),

    actions: {
        setToken(token: string) {
            this.accessToken = token
            localStorage.setItem("access_token", token)
        },

        logout() {
            this.accessToken = null
            localStorage.removeItem("access_token")
        }
    }
})