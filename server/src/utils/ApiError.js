/**
 * Operational error carrying an HTTP status code and optional payload.
 * Thrown by services/controllers and rendered by the error middleware.
 */
export class ApiError extends Error {
  constructor(statusCode, message, payload = undefined) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.payload = payload;
    this.isOperational = true;
  }

  static badRequest(message, payload) {
    return new ApiError(400, message, payload);
  }

  static badGateway(message, payload) {
    return new ApiError(502, message, payload);
  }

  static internal(message, payload) {
    return new ApiError(500, message, payload);
  }
}
