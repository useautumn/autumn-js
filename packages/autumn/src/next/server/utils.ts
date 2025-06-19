import { Result } from "src/sdk/response";
import { AutumnError, ErrorResponse } from "../../sdk";

export const toServerResponse = <T>(
  result: Result<T, AutumnError>
): Result<T, ErrorResponse> => {
  if (result.error) {
    return {
      data: null,
      error: result.error.toJSON(),
    };
  }

  return {
    data: result.data,
    error: null,
  };
};
