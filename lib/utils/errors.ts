// lib/utils/errors.ts

export class MCPError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly server: "food" | "instamart" | "dineout"
  ) {
    super(message)
    this.name = "MCPError"
  }

  get isAuthError(): boolean {
    return this.statusCode === 401
  }

  get isRateLimited(): boolean {
    return this.statusCode === 429
  }

  get isServerError(): boolean {
    return this.statusCode >= 500
  }

  get isRetryable(): boolean {
    return this.isRateLimited || this.isServerError
  }
}

export class LLMError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly isRetryable: boolean
  ) {
    super(message)
    this.name = "LLMError"
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}
