<script setup lang="ts">
import { onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const login = async () => {
    try {
        const form = new URLSearchParams();
        form.append("username", "API");
        form.append("password", "1234");

        const response = await axios.post(
            "http://127.0.0.1:8000/auth/token",
            form,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true, // Necesario para guardar la cookie refresh_token
            }
        );

        const auth = useAuthStore()
        auth.setToken(response.data.access_token)

        console.log("Access token:", response.data.access_token);
        console.log("Refresh cookie guardada correctamente.");
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    login();
});
</script>

<template>
    <div>
        <h2>Login</h2>
        <p>Realizando autenticación...</p>
    </div>
</template>