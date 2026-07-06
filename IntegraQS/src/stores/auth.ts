import { defineStore } from "pinia"

interface AuthState {
    accessToken: string | null
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        accessToken: null
    }),

    actions: {
        setToken(token: string) {
            this.accessToken = token
        },
        logout() {
            this.accessToken = null
        }
    }

})