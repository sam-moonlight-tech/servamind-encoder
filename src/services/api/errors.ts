export class ApiError extends Error {
  status: number;
  code?: number;

  constructor(message: string, status: number, code?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }

  static fromResponse(
    response: Response,
    body?: { message?: string; code?: number }
  ) {
    return new ApiError(
      body?.message || response.statusText || "Unknown error",
      response.status,
      body?.code
    );
  }
}
