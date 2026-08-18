<template>
  <div class="lookup-field" ref="searchControllerRef">
    <!-- Campos principales -->
    <div class="lookup-field__controls">
      <!-- Identificador -->
      <input
        class="lookup-field__id"
        type="text"
        v-model="inputId"
        placeholder="Código"
        @change="selectOptionById"
        @keyup.enter="selectOptionById"
        @dblclick="toggleDropdown"
      />

      <!-- Botón de búsqueda -->
      <button
        class="lookup-field__button"
        type="button"
        aria-label="Seleccionar una opción"
        @click="toggleDropdown"
      >
        <svg class="lookup-field__button-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
        </svg>
      </button>

      <!-- Descripción -->
      <input
        class="lookup-field__description"
        type="text"
        :value="props.modelValue?.description || ''"
        placeholder="Descripción"
        readonly
        tabindex="-1"
      />
    </div>

    <!-- Desplegable -->
    <div class="lookup-field__dropdown" v-if="isDropdownOpen">
      <!-- Buscador -->
      <div class="lookup-field__search">
        <svg class="lookup-field__search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
        </svg>

        <input
          class="lookup-field__search-input"
          type="text"
          v-model="searchTerm"
          placeholder="Buscar por código o descripción..."
        />
      </div>

      <!-- Cabecera del listado -->
      <div class="lookup-field__options-header">
        <span>Código</span>
        <span>Descripción</span>
      </div>

      <!-- Opciones -->
      <div class="lookup-field__options" @scroll="handleScroll">
        <button
          v-for="option in options"
          :key="getOptionKey(option)"
          @click="selectOption(option)"
          class="lookup-field__option"
          :class="option.selected ? 'lookup-field__option--selected' : ''"
          type="button"
        >
          <span class="lookup-field__option-id"> {{ option.id }} </span>

          <span class="lookup-field__option-description"> {{ option.description }} </span>
        </button>
      </div>

      <!-- Estado vacío.
           Déjalo comentado mientras muestras las opciones. -->
      <!--
      <div class="lookup-field__empty">
        <div class="lookup-field__empty-icon">⌕</div>

        <strong>No se encontraron resultados</strong>

        <span>
          Prueba con otro código o descripción.
        </span>
      </div>
      -->

      <!-- Pie del desplegable -->
      <div class="lookup-field__footer">
        <!-- <span>Selecciona una opción</span> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, onBeforeUnmount } from "vue";
import type { DynamicModel } from "@/types/types";
import { getOptions } from "@/services/iqs.service";
// type Option = {
//   id: string;
//   description: string;
// };
// Variables y props:
const isLoadingMore = ref(false); // Controlar si estoy cargando más.
const options = ref<DynamicModel[]>([]); // Lista de opciones cargadas.
const offset = ref(0); // Controlar el offset para la paginación.
const limit = ref(50); // Controlar límite de la búsqueda.
const searchTerm = ref(""); // Controlar el término de búsqueda.
const searchTime = 0o500; // Tiempo de espera para realizar una búsqueda.
const isDropdownOpen = ref(false); // Control del dropdown (Visual)
const inputId = ref(""); // Control de ID
const searchControllerRef = ref<HTMLElement | null>(null); // Referencia al componente para controlar clicks fuera del mismo.

let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined; // Controlar el tiempo de búsqueda

// El componente recibirá. El modelo y puede recibir o no un optionValue. Por defecto es id. Esto lo necesitamos para que
// el componente pueda trabajar con DynamicModel igual que otros inputs. De está manera podemos llamar a todos desde un mismo manager a futuro.
const props = withDefaults(
  defineProps<{
    modelValue: DynamicModel | null;
    optionValue?: string;
    field?: string; // 2026-08-18 Santi. Agrego el field como prop para poder pasarlo al getOptions y que busque por el campo correcto.
  }>(),
  {
    optionValue: "id",
    field: undefined,
  },
);
const emit = defineEmits<{
  "update:modelValue": [value: DynamicModel | null];
  change: [value: DynamicModel | null];
}>();

// Como trabajamos con Dynamic model. Typescript no me permite poner una key que ellos entienden que pueda no existir.
// Esto no ocurrirá nunca, pero el editar da problemas. Por tanto debemos controlarlo con una función que nos devuelva la key.
function getOptionKey(option: DynamicModel): string | number {
  const value = option[props.optionValue];

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  throw new Error(
    `SearchController: la propiedad "${props.optionValue}" debe ser string o number.`,
  );
}
// ----- GESTIÓN DEL DROPDOWN ----- //
function toggleDropdown(): void {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as Node;

  if (searchControllerRef.value && !searchControllerRef.value.contains(target)) {
    isDropdownOpen.value = false;
  }
}
// ----- GESTIÓN DE CARGADO DE OPCIONES, SCROLLEO Y BÚSQUEDA ------ //
function handleScroll(event: Event): void {
  const container = event.currentTarget as HTMLElement;

  const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 5;
  // Mandamos a cargar más registros si estamos al final.
  if (isAtBottom && !isLoadingMore.value) {
    loadMoreOptions();
  }
}

// Carga opciones
async function loadMoreOptions(): Promise<void> {
  if (isLoadingMore.value) {
    return;
  }

  isLoadingMore.value = true;

  try {
    const newOptions = await getOptions(
      props.field ?? "cus_id",
      limit.value,
      offset.value,
      searchTerm.value.trim(),
    );

    options.value.push(...newOptions);
    offset.value += newOptions.length;

    validateSelected();
  } finally {
    isLoadingMore.value = false;
  }
}

// Reseteo de opciones.
function resetOptions() {
  options.value = [];
  offset.value = 0;
}

// Búsqueda de valores por la barra de búsqueda.
async function searchOption(searchValue: string): Promise<void> {
  resetOptions();
  isLoadingMore.value = true;

  try {
    const fieldOption = props.field ?? "cus_id";
    const newOptions = await getOptions(fieldOption, limit.value, offset.value, searchValue);

    options.value.push(...newOptions);
    offset.value += newOptions.length;

    validateSelected();
  } finally {
    isLoadingMore.value = false;
  }
}

// Loopea por las opciones y cambia el selected para que pueda pintarse correctamente.
function validateSelected() {
  options.value.forEach((option) => {
    if (props.modelValue && option.id === props.modelValue.id) {
      option.selected = true;
    } else {
      option.selected = false;
    }
  });
}

// Función que emitirá eventos y cambios en el modelo al cambiar la opción seleccionada.
function selectOption(option: DynamicModel): void {
  emit("update:modelValue", option);
  emit("change", option);
  toggleDropdown();
  validateSelected();
}

async function selectOptionById(): Promise<void> {
  const searchedValue = inputId.value.trim();
  // Si dejamos el inputId vacío. No hacemos nada.
  if (!searchedValue) {
    emit("update:modelValue", null);
    emit("change", null);
    return;
  }

  isLoadingMore.value = true;

  try {
    const fieldOption = props.field ?? "cus_id";
    //const results = await getOptions("cus_id", 50, 0, searchedValue);
    const results = await getOptions(fieldOption, 50, 0, searchedValue);
    const searchedOption = results.find((option: DynamicModel) => {
      const optionId = option[props.optionValue];

      return optionId !== null && optionId !== undefined && String(optionId) === searchedValue;
    });

    if (!searchedOption) {
      emit("update:modelValue", null);
      emit("change", null);
      return;
    } else {
      searchedOption.active = true;
    }

    emit("update:modelValue", searchedOption);
    emit("change", searchedOption);

    validateSelected();
  } catch (error) {
    console.error("Error buscando la opción por ID:", error);
  } finally {
    isLoadingMore.value = false;
    isDropdownOpen.value = false;
  }
}

// Watchers.
// Funcionan de la siguiente manera.
// PRIMER PARAMETRO: Valor que VUE debe vigilar. --> En este caso devolverá el id del modelo. Osea, si cambia el ID activamos esta función.
// SEGUNDO PARAMETRO: Lo que se ejecutará al cambiar. --> En este caso, se ejecutarán los cambios para que el modelo se seleccione.
watch(
  () => props.modelValue?.[props.optionValue],
  (newValue) => {
    inputId.value = newValue === null || newValue === undefined ? "" : String(newValue);

    validateSelected();
  },
  {
    immediate: true,
  },
);

// Watcher del termino de búsqueda. Únicamente se modificará en caso de que el usuario esté utilizando el input de búsqueda.
// Si se modifica el termino comprobamos con un tiempo de espera.
watch(searchTerm, (newSearchTerm) => {
  // Si el contador existe. Lo borro.
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  // Si se ha cambiado el input, creo un nuevo contador.
  searchDebounceTimer = setTimeout(() => {
    searchOption(newSearchTerm.trim());
  }, searchTime);
});

// Al montar el componente.
onMounted(() => {
  // Cargo las primeras opciones.
  loadMoreOptions();
  // Valido que la opción seleccionada se encuentre entre las opciones.
  validateSelected();

  // Agrego un listener para controlar clicks fuera del componente.
  document.addEventListener("click", handleClickOutside);
});

// Antes de desmontar el componente.
// Esto tiene sentido en caso de tener una ventana modal. Ya que el contador puede estar activo y el componente no existir más.
// Por tanto, al desmontar debo eliminar el contador, sino podríamos tener errores.
onBeforeUnmount(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  // Elimino el listener para controlar clicks fuera del componente.
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.lookup-field {
  --lookup-primary: #2563eb;
  --lookup-primary-soft: #eff6ff;
  --lookup-primary-border: #bfdbfe;

  --lookup-text: #172033;
  --lookup-text-secondary: #667085;
  --lookup-placeholder: #98a2b3;

  --lookup-border: #d0d5dd;
  --lookup-border-soft: #eaecf0;

  --lookup-background: #ffffff;
  --lookup-background-soft: #f8fafc;
  --lookup-background-hover: #f9fafb;

  position: relative;
  width: 100%;
  /* max-width: 720px; */

  color: var(--lookup-text);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

/* --------------------------------------------------
   Controles principales
-------------------------------------------------- */

.lookup-field__controls {
  display: grid;
  grid-template-columns: 130px 42px minmax(220px, 1fr);
  width: 100%;
}

.lookup-field__id,
.lookup-field__description,
.lookup-field__search-input {
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 0 12px;

  border: 1px solid var(--lookup-border);
  outline: none;

  background: var(--lookup-background);
  color: var(--lookup-text);

  font: inherit;
  font-size: 14px;

  box-sizing: border-box;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;
}

.lookup-field__id {
  border-radius: 7px 0 0 7px;
}

.lookup-field__description {
  border-left: 0;
  border-radius: 0 7px 7px 0;

  background: var(--lookup-background-soft);
  color: var(--lookup-text-secondary);
}

.lookup-field__id::placeholder,
.lookup-field__description::placeholder,
.lookup-field__search-input::placeholder {
  color: var(--lookup-placeholder);
}

.lookup-field__id:hover,
.lookup-field__description:hover {
  border-color: #98a2b3;
}

.lookup-field__id:focus {
  position: relative;
  z-index: 2;

  border-color: var(--lookup-primary);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 12%);
}

/* --------------------------------------------------
   Botón
-------------------------------------------------- */

.lookup-field__button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 40px;
  padding: 0;

  border: 1px solid var(--lookup-border);
  border-left: 0;

  background: var(--lookup-background-soft);
  color: var(--lookup-text-secondary);

  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;
}

.lookup-field__button:hover {
  position: relative;
  z-index: 1;

  border-color: var(--lookup-primary);
  background: var(--lookup-primary-soft);
  color: var(--lookup-primary);
}

.lookup-field__button:focus-visible {
  position: relative;
  z-index: 2;

  outline: none;
  border-color: var(--lookup-primary);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 12%);
}

.lookup-field__button-icon,
.lookup-field__search-icon {
  width: 18px;
  height: 18px;

  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* --------------------------------------------------
   Desplegable
-------------------------------------------------- */

.lookup-field__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 1000;

  width: 100%;
  overflow: hidden;

  border: 1px solid var(--lookup-border-soft);
  border-radius: 10px;

  background: var(--lookup-background);

  box-shadow:
    0 12px 24px rgb(16 24 40 / 10%),
    0 4px 8px rgb(16 24 40 / 6%);
}

/* --------------------------------------------------
   Buscador
-------------------------------------------------- */

.lookup-field__search {
  position: relative;
  padding: 12px;

  border-bottom: 1px solid var(--lookup-border-soft);
  background: var(--lookup-background);
}

.lookup-field__search-icon {
  position: absolute;
  top: 50%;
  left: 25px;

  color: var(--lookup-placeholder);
  pointer-events: none;

  transform: translateY(-50%);
}

.lookup-field__search-input {
  height: 38px;
  padding-left: 38px;

  border-radius: 7px;
  background: var(--lookup-background-soft);
}

.lookup-field__search-input:hover {
  border-color: #98a2b3;
}

.lookup-field__search-input:focus {
  border-color: var(--lookup-primary);
  background: var(--lookup-background);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 10%);
}

/* --------------------------------------------------
   Cabecera
-------------------------------------------------- */

.lookup-field__options-header {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 12px;

  padding: 9px 16px;

  border-bottom: 1px solid var(--lookup-border-soft);
  background: var(--lookup-background-soft);

  color: var(--lookup-text-secondary);

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* --------------------------------------------------
   Opciones
-------------------------------------------------- */

.lookup-field__options {
  max-height: 260px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.lookup-field__option {
  position: relative;

  display: grid;
  grid-template-columns: 130px minmax(0, 1fr);
  gap: 12px;
  align-items: center;

  width: 100%;
  min-height: 46px;
  padding: 10px 42px 10px 16px;

  border: 0;
  border-bottom: 1px solid var(--lookup-border-soft);

  background: var(--lookup-background);
  color: var(--lookup-text);

  font: inherit;
  font-size: 14px;
  text-align: left;

  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}

.lookup-field__option:last-child {
  border-bottom: 0;
}

.lookup-field__option:hover {
  background: var(--lookup-background-hover);
}

.lookup-field__option:focus-visible {
  z-index: 1;

  outline: 2px solid var(--lookup-primary);
  outline-offset: -2px;
}

.lookup-field__option--selected {
  background: var(--lookup-primary-soft);
}

.lookup-field__option--selected:hover {
  background: #e4efff;
}

.lookup-field__option-id {
  overflow: hidden;

  color: var(--lookup-text-secondary);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lookup-field__option--selected .lookup-field__option-id {
  color: var(--lookup-primary);
}

.lookup-field__option-description {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.lookup-field__selected-icon {
  position: absolute;
  top: 50%;
  right: 16px;

  width: 18px;
  height: 18px;

  fill: none;
  stroke: var(--lookup-primary);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;

  transform: translateY(-50%);
}

/* --------------------------------------------------
   Estado vacío
-------------------------------------------------- */

.lookup-field__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  padding: 32px 20px;

  color: var(--lookup-text-secondary);
  text-align: center;
}

.lookup-field__empty strong {
  color: var(--lookup-text);
  font-size: 14px;
}

.lookup-field__empty span {
  font-size: 13px;
}

.lookup-field__empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;
  margin-bottom: 4px;

  border-radius: 50%;

  background: var(--lookup-background-soft);
  color: var(--lookup-placeholder);

  font-size: 24px;
}

/* --------------------------------------------------
   Pie
-------------------------------------------------- */

.lookup-field__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 9px 14px;

  border-top: 1px solid var(--lookup-border-soft);
  background: var(--lookup-background-soft);

  color: var(--lookup-text-secondary);
  font-size: 12px;
}

/* --------------------------------------------------
   Scroll
-------------------------------------------------- */

.lookup-field__options::-webkit-scrollbar {
  width: 8px;
}

.lookup-field__options::-webkit-scrollbar-track {
  background: transparent;
}

.lookup-field__options::-webkit-scrollbar-thumb {
  border: 2px solid var(--lookup-background);
  border-radius: 10px;
  background: #d0d5dd;
}

/* --------------------------------------------------
   Responsive
-------------------------------------------------- */

@media (max-width: 600px) {
  .lookup-field__controls {
    grid-template-columns: 95px 42px minmax(130px, 1fr);
  }

  .lookup-field__options-header,
  .lookup-field__option {
    grid-template-columns: 95px minmax(0, 1fr);
  }

  .lookup-field__dropdown {
    min-width: 340px;
  }
}
</style>
