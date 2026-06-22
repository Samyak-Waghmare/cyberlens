import { MIN_INPUT_LENGTH } from "../constants/index.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Validate + sanitise the /analyze request body.
 * Attaches the trimmed input to req.validatedInput.
 */
export function validateAnalyze(req, res, next) {
  const input = (req.body?.input || "").toString().trim();

  const fileHash = req.body?.fileHash || null;

  if (input.length < MIN_INPUT_LENGTH && !fileHash) {
    return next(
      ApiError.badRequest(
        `Input must be at least ${MIN_INPUT_LENGTH} characters long or provide a file to scan.`
      )
    );
  }

  req.validatedInput = input;
  req.fileHash = fileHash;
  next();
}
