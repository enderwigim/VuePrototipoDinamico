export function buildComponentStyles(styles) {
  if (!styles) {
    return {};
  }

  const result = {};

  if (styles.height) {
    result.height = styles.height + "px";
  }

  if (styles.width) {
    result.width = styles.width + "px";
  }

  if (styles.object_fit) {
    result.objectFit = styles.object_fit + "px";
  }
  console.log("Resultado estilos");
  console.log(result);
  return result;
}
