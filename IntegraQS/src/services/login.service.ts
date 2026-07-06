import api from "@/services/axios"
import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()

export async function refreshToken(formData: FormData) {
    const response = await api.post<{
        access_token: string
    }>(
        "/auth/token",
        formData
    )

    auth.setToken(
        response.data.access_token
    )
}