export interface ErrorResponse {
  message: string;
  code: string;
}

export class AutumnError extends Error {
  public readonly message: string;
  public readonly code: string;

  constructor(response: ErrorResponse) {
    super(response.message);
    this.message = response.message;
    this.code = response.code;
  }

  toString() {
    return `${this.message} (code: ${this.code})`;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}
