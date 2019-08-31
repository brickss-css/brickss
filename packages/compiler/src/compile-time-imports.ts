export interface CSS {
  [key: string]: string | CSS;
}

export function css(_style: CSS) {
  return (undefined as any) as {
    (state: Record<string, boolean>): string;
    [key: string]: string;
  };
}

export function cssVar(
  _name: string,
  _defaultValue: string
): { name: string; defaultValue: string } {
  return (undefined as any) as { name: string; defaultValue: string };
}
