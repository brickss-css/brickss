export class CompilationError extends Error {
  private code: string;
  private msg: string;
  private hint?: string;

  constructor(code: string, msg: string, hint?: string) {
    super(`Error ${code}: ${msg}`);
    this.code = code;
    this.msg = msg;
    this.hint = hint;
  }

  toString() {
    return `Error ${this.code}: ${this.msg}${
      this.hint ? "\n\n" + this.hint : ""
    }`;
  }
}
