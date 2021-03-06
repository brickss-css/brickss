export interface CSS {
  [key: string]: string | number | CSS;
}

export function css(_style: CSS) {
  return (undefined as any) as {
    scope: (state?: Record<string, boolean | string>) => string;
    [key: string]: () => string;
  };
}

export function cssVar(
  _name: string,
  _defaultValue: string | number
): { name: string; defaultValue: string } {
  return (undefined as any) as { name: string; defaultValue: string };
}
