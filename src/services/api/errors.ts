export class ApiError extends Error {
  status: number;
  errorCode: string;

  constructor(message: string, status: number, errorCode: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }

  static fromResponse(
    response: Response,
    body?: { detail?: string }
  ) {
    const detail = body?.detail || response.statusText || "Unknown error";
    return new ApiError(
      detail,
      response.status,
      ApiError.inferErrorCode(response.status, detail)
    );
  }

  private static inferErrorCode(status: number, detail: string): string {
    const lower = detail.toLowerCase();
    if (status === 409 && lower.includes("duplicate")) return "DUPLICATE_REQUEST";
    if (status === 409 && lower.includes("not yet complete")) return "FILE_NOT_READY";
    if (status === 429 || lower.includes("quota")) return "QUOTA_EXCEEDED";
    if (status === 410 || lower.includes("already downloaded")) return "FILE_ALREADY_DOWNLOADED";
    if (status === 401) return "UNAUTHORIZED";
    if (status === 403) return "FORBIDDEN";
    if (status === 404) return "NOT_FOUND";
    return "UNKNOWN_ERROR";
  }

  get isDuplicateRequest(): boolean {
    return this.errorCode === "DUPLICATE_REQUEST";
  }

  get isQuotaExceeded(): boolean {
    return this.errorCode === "QUOTA_EXCEEDED";
  }

  get isFileAlreadyDownloaded(): boolean {
    return this.errorCode === "FILE_ALREADY_DOWNLOADED";
  }

  get isFileNotReady(): boolean {
    return this.errorCode === "FILE_NOT_READY";
  }
}
