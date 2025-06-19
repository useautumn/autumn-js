import { AutumnError } from "./error";

type Success<T> = {
  data: T;
  error: null;
  statusCode?: number;
};

type Failure<E> = {
  data: null;
  error: E;
  statusCode?: number;
};

export const toContainerResult = async (
  response: Response
): Promise<Result<any, AutumnError>> => {
  if (response.status < 200 || response.status >= 300) {
    let error: any;
    try {
      error = await response.json();
    } catch (error) {
      return {
        data: null,
        error: new AutumnError({
          message: "Failed to parse JSON response from Autumn",
          code: "internal_error",
        }),
        statusCode: response.status,
      };
    }

    return {
      data: null,
      error: new AutumnError({
        message: error.message,
        code: error.code,
      }),
      statusCode: response.status,
    };
  }

  try {
    let data = await response.json();

    return {
      data: data,
      error: null,
      statusCode: response?.status,
    };
  } catch (error) {
    return {
      data: null,
      error: new AutumnError({
        message: "Failed to parse Autumn API response",
        code: "internal_error",
      }),
      statusCode: response?.status,
    };
  }
};

export type Result<T, E> = Success<T> | Failure<E>;
export type AutumnPromise<T> = Promise<Result<T, AutumnError>>;
