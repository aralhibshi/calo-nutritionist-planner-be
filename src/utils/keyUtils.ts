export function pascalToSnake(
  str: string
): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

export function snakeToPascal(
  str: string
): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function convertKeys(
  input: Record<string, any>,
  converter: (key: string) => string
): Record<string, any> {
  return Object.keys(input).reduce((output, key) => {
    output[converter(key)] = input[key];
    return output;
  }, {});
}