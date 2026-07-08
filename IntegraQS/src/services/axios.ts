import axios, {
    AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig
} from "axios"

import { useAuthStore } from "@/stores/auth"

const api: AxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    withCredentials: true
})


// ==============================
// REQUEST INTERCEPTOR
// ==============================

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const auth = useAuthStore()
        if (auth.accessToken) {
            config.headers.Authorization =`Bearer ${auth.accessToken}`
        }
        return config
    }
)


// ==============================
// RESPONSE INTERCEPTOR
// ==============================

api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
        const auth = useAuthStore()
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean
        }
        if (originalRequest.url?.includes("/auth/refresh")) {
            auth.logout()
            window.location.href = "/login"
            return Promise.reject(error)
        }
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const response = await api.post<{access_token: string}>("/auth/refresh")
                auth.setToken(response.data.access_token)

                originalRequest.headers.Authorization =
                    `Bearer ${response.data.access_token}`

                return api(originalRequest)

            }
            catch {
                auth.logout()
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)

export default api