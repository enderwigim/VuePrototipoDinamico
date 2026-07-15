// src/stores/window.store.ts
import type { WinState } from "@/types/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWindowStore = defineStore("window", function () {
  const winState = ref<WinState>("read");

  function setRead() {
    winState.value = "read";
  }

  function setModify() {
    winState.value = "modify";
  }

  function setCreation() {
    winState.value = "creation";
  }

  return {
    winState,
    setRead,
    setModify,
    setCreation,
  };
});
