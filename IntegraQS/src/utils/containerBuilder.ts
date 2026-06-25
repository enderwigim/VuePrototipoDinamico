export type Breakpoint = "default" | "sm" | "md" | "lg" | "xl" | "2xl";

export type GridColsValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | "auto";

export type ResponsiveValues<T> = Partial<Record<Breakpoint, T>>;

export interface SpacingStyles {
  all?: ResponsiveValues<SpacingValue>;
  x?: ResponsiveValues<SpacingValue>;
  y?: ResponsiveValues<SpacingValue>;
  left?: ResponsiveValues<SpacingValue>;
  right?: ResponsiveValues<SpacingValue>;
  top?: ResponsiveValues<SpacingValue>;
  bottom?: ResponsiveValues<SpacingValue>;
}

export interface ContainerStyles {
  display?: "grid" | "flex" | string;
  grid_cols?: ResponsiveValues<GridColsValue>;
  gap?: ResponsiveValues<SpacingValue>;
  padding?: SpacingStyles;
  margin?: SpacingStyles;
}

const BREAKPOINTS: Record<Breakpoint, string> = {
  default: "",
  sm: "sm:",
  md: "md:",
  lg: "lg:",
  xl: "xl:",
  "2xl": "2xl:",
};

const GRID_COLS_CLASSES: Record<GridColsValue, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const SPACING_CLASSES: Record<SpacingValue, string> = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  8: "8",
  10: "10",
  12: "12",
  auto: "auto",
};

function applyPrefix(breakpoint: Breakpoint, className: string): string {
  const prefix = BREAKPOINTS[breakpoint];

  return `${prefix}${className}`;
}

function buildResponsiveClass<T extends string | number>(
  values: ResponsiveValues<T> | undefined,
  classMap: Record<string, string>,
): string[] {
  const classes: string[] = [];

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

    classes.push(applyPrefix(breakpoint as Breakpoint, className));
  });

  return classes;
}

function buildGridColsClasses(values?: ResponsiveValues<GridColsValue>): string[] {
  return buildResponsiveClass(values, GRID_COLS_CLASSES);
}

function buildSpacingClasses(prefix: string, values?: ResponsiveValues<SpacingValue>): string[] {
  const classes: string[] = [];

  if (!values) {
    return classes;
  }

  Object.entries(values).forEach(([breakpoint, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const spacingValue = SPACING_CLASSES[value];

    if (!spacingValue) {
      return;
    }

    const className = `${prefix}-${spacingValue}`;

    classes.push(applyPrefix(breakpoint as Breakpoint, className));
  });

  return classes;
}

function buildPaddingClasses(padding?: SpacingStyles): string[] {
  if (!padding) {
    return [];
  }

  return [
    ...buildSpacingClasses("pl", padding.left),
    ...buildSpacingClasses("pr", padding.right),
    ...buildSpacingClasses("pt", padding.top),
    ...buildSpacingClasses("pb", padding.bottom),
    ...buildSpacingClasses("p", padding.all),
    ...buildSpacingClasses("px", padding.x),
    ...buildSpacingClasses("py", padding.y),
  ];
}

function buildMarginClasses(margin?: SpacingStyles): string[] {
  if (!margin) {
    return [];
  }

  return [
    ...buildSpacingClasses("ml", margin.left),
    ...buildSpacingClasses("mr", margin.right),
    ...buildSpacingClasses("mt", margin.top),
    ...buildSpacingClasses("mb", margin.bottom),
    ...buildSpacingClasses("m", margin.all),
    ...buildSpacingClasses("mx", margin.x),
    ...buildSpacingClasses("my", margin.y),
  ];
}

export function buildContainerClasses(styles?: ContainerStyles): string {
  const classes: string[] = [];

  if (!styles) {
    return "";
  }

  if (styles.display === "grid") {
    classes.push("grid");
    classes.push(...buildGridColsClasses(styles.grid_cols));
  }

  if (styles.display === "flex") {
    classes.push("flex");
  }

  classes.push(...buildSpacingClasses("gap", styles.gap));
  classes.push(...buildPaddingClasses(styles.padding));
  classes.push(...buildMarginClasses(styles.margin));

  return classes.join(" ");
  console.log("Container classes:", classes.join(" "));
}
