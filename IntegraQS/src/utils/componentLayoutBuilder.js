const BREAKPOINTS = {
  default: "",
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
  "2xl": "2xl:",
};

const COL_SPAN_CLASSES = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const ROW_SPAN_CLASSES = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
  7: "row-span-7",
  8: "row-span-8",
  9: "row-span-9",
  10: "row-span-10",
  11: "row-span-11",
  12: "row-span-12",
};

// El prefijo que se contruirá será tomando sm,md,lg y defauklt
function applyPrefix(breakpoint, className) {
  const prefix = BREAKPOINTS[breakpoint];

  return `${prefix}${className}`;
}

// Función generica que utilizaremos para la construcción de cada clase.
function buildResponsiveClass(values, classMap) {
  const classes = [];
  console.log(values);
  // Si no le paso valores, lo devuelvo vacío.
  if (!values) {
    return classes;
  }

  Object.entries(values).forEach(([breakpoint, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const className = classMap[String(value)];

    if (!className) {
      return;
    }

    classes.push(applyPrefix(breakpoint, className));
  });
  console.log(classes);
  return classes;
}

// Columnas
function buildColSpanClasses(values) {
  return buildResponsiveClass(values, COL_SPAN_CLASSES);
}

// Rows
function buildRowSpanClasses(values) {
  return buildResponsiveClass(values, ROW_SPAN_CLASSES);
}

// Función que genera las clases del componente:
export function buildLayoutClasses(styles) {
  console.log("ESTILOS");
  console.log(styles);
  const classes = [];

  if (!styles) {
    return "";
  }

  // Los componentes utilizarán únicamente como Layout
  classes.push(...buildColSpanClasses(styles.col_span));
  classes.push(...buildRowSpanClasses(styles.row_span));

  return classes.join(" ");
}
