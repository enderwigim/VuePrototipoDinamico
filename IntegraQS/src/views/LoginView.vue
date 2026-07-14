<template>
  <main
    class="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4"
  >
    <section
      class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/70 dark:shadow-black/40 px-8 py-8"
    >
      <div class="mb-8 text-center flex flex-col items-center">
        <img
            src="/Logo_Integra.jpg"
            alt="Logo Integra"
            class="h-20 w-auto object-contain"
        />
        <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Iniciar sesión</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Accede al panel de gestión</p>
      </div>

      <form class="space-y-5" @submit.prevent="login">
        <div class="space-y-2">
          <label for="username" class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Usuario
          </label>

          <IQSInputTextBase
            id="username"
            v-model="username"
            name="username"
            placeholder="Introduce tu usuario"
            autocomplete="username"
          />
        </div>

        <div class="space-y-2">
          <label for="password" class="text-sm font-medium text-slate-700 dark:text-slate-300">
            Contraseña
          </label>

          <IQSInputTextBase
            id="password"
            v-model="password"
            name="password"
            type="password"
            placeholder="Introduce tu contraseña"
            autocomplete="current-password"
          />
        </div>

        <p
          v-if="errorMessage"
          class="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-600 dark:text-red-300"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-blue-400 bg-blue-400 text-white px-4 text-sm font-medium shadow-sm transition-colors duration-200 hover:bg-blue-500 hover:border-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 focus:outline-none focus:ring-0"
        >
          <span v-if="loading">Accediendo...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <div
        class="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4 text-center text-xs text-slate-400 dark:text-slate-500"
      >
        IntegraQS · Panel de gestión empresarial
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import { useAuthStore } from "@/stores/auth";
import IQSInputTextBase from "@/components/inputs/base/IQSInputTextBase.vue";

const router = useRouter();
const route = useRoute();

const username = ref("");
const password = ref("");

const loading = ref(false);
const errorMessage = ref("");

function getRedirectPath(): string {
  const redirect = route.query.redirect;
  console.log("Redirect query parameter:", redirect);
  if (typeof redirect !== "string") {
    return "/iqs/customers";
  }

  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    return "/";
  }

  return redirect;
}

async function login() {
  errorMessage.value = "";
  loading.value = true;

  try {
    const form = new URLSearchParams();

    form.append("username", username.value);
    form.append("password", password.value);

    const response = await axios.post("http://127.0.0.1:8000/auth/token", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    });

    const auth = useAuthStore();

    auth.setToken(response.data.access_token);

    const redirectPath = getRedirectPath();
    console.log("Redirecting to:", redirectPath);
    await router.replace(redirectPath);
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      errorMessage.value = "Usuario o contraseña incorrectos.";
    } else {
      errorMessage.value = "No se pudo iniciar sesión. Inténtalo de nuevo.";
    }
  } finally {
    loading.value = false;
  }
}
</script>
