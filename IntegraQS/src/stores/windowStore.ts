// src/stores/window.store.ts
import type { WinState, WindowType, WindowInstance, RegisterWindowOptions } from "@/types/types";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useWindowStore = defineStore("window", function () {
  // Almacenaremos todas las instancias de ventanas abiertas en un array reactivo.
  const windows = ref<Record<string, WindowInstance>>({});

  // Identificador de ventana actualmente activa (La que esté en primer plano)
  const activeWindowId = ref<string | null>(null);
  let instanceCounter = 0; // Contador para generar identificadores únicos de instancias

  const activeWindow = computed(() => {
    if (!activeWindowId.value) return null;

    return windows.value[activeWindowId.value] || null;
  });

  // Generamos un identificado único para cada instancia de ventana abierta.
  function createWindowId(windowName: string): string {
    instanceCounter++;

    return `${windowName}-${instanceCounter}`;
  }

  // Registramos una nueva instancia de ventana.
  function registerWindow(options: RegisterWindowOptions): string {
    const instanceId = createWindowId(options.windowName);

    const windowInstance: WindowInstance = {
      instanceId,
      windowName: options.windowName,
      state: options.initialState ?? "read",
      type: options.type ?? "base",
      parentId: options.parentId ?? null,
    };

    windows.value[instanceId] = windowInstance;

    // La última ventana abierta pasa a ser la activa.
    activeWindowId.value = instanceId;

    return instanceId;
  }

  /**
   * Cambia el estado de una instancia concreta.
   */
  function setWindowState(instanceId: string, state: WinState): void {
    const windowInstance = windows.value[instanceId];

    if (!windowInstance) {
      throw new Error(`No existe una ventana con el identificador "${instanceId}".`);
    }

    windowInstance.state = state;
  }

  function unregisterWindow(instanceId: string): void {
    const windowInstance = windows.value[instanceId];

    if (!windowInstance) {
      return;
    }

    const parentId = windowInstance.parentId;

    delete windows.value[instanceId];

    if (activeWindowId.value === instanceId) {
      activeWindowId.value = parentId && windows.value[parentId] ? parentId : null;
    }
  }

  function setActiveWindow(instanceId: string): void {
    if (!windows.value[instanceId]) {
      throw new Error(`No existe una ventana con el identificador "${instanceId}".`);
    }

    activeWindowId.value = instanceId;
  }

  return {
    windows,
    activeWindowId,
    activeWindow,

    registerWindow,
    unregisterWindow,
    setActiveWindow,
    setWindowState,
  };
});
