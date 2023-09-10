export function capitalizeFirstLetter(
  string: string
): string {
  const decodedString = string.replace(/%20/g, ' ');

  return decodedString.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}