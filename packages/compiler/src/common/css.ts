export function isSelector(str: string): boolean {
  return (
    str.startsWith(".") ||
    str.startsWith("#") ||
    isPsuedoSelector(str) ||
    isModifier(str)
  );
}

export function isModifier(str: string): boolean {
  return str.startsWith("[state|");
}

export function isPsuedoSelector(str: string): boolean {
  return str.startsWith(":");
}

export function isAtRule(str: string): boolean {
  return str.startsWith("@");
}

export function isElementSelector(str: string): boolean {
  return (
    !isPsuedoSelector(str) &&
    !isModifier(str) &&
    !str.startsWith(".") &&
    !str.startsWith("#") &&
    !str.startsWith("[")
  );
}
