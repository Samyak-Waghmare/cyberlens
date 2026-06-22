import { MIN_INPUT_LENGTH } from "../constants/index.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Validate + sanitise the /analyze request body.
 * Attaches the trimmed input to req.validatedInput.
 */
export function validateAnalyze(req, res, next) {
  const input = (req.body?.input || "").toString().trim();

  if (input.length < MIN_INPUT_LENGTH) {
    return next(
      ApiError.badRequest(
        `Input must be at least ${MIN_INPUT_LENGTH} characters long.`
      )
    );
  }

  req.validatedInput = input;
  next();
}
