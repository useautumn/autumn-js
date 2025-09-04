import { AutumnError } from "./error";

export type Success<T> = {
  data: T;
  error: null;
  statusCode?: number;
};

type Failure<E> = {
  data: null;
  error: E;
  statusCode?: number;
};

export const toContainerResult = async ({
  response,
  logger,
  logError = true,
}: {
  response: Response;
  logger: Console;
  logError?: boolean;
}): Promise<Result<any, AutumnError>> => {
  if (response.status < 200 || response.status >= 300) {
    let error: any;
    try {
      error = await response.json();
      if (logError) {
        logger.error(`[Autumn] ${error.message}`);
      }
    } catch (error) {
      // biome-ignore lint/complexity/noUselessCatch: idk
      throw error;
      // return {
      //   data: null,
      //   error: new AutumnError({
      //     message: "Failed to parse JSON response from Autumn",
      //     code: "internal_error",
      //   }),
      //   statusCode: response.status,
      // };
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
    const data = await response.json();
    return {
      data: data,
      error: null,
      statusCode: response?.status,
    };
  } catch (error) {
    // biome-ignore lint/complexity/noUselessCatch: idk
    throw error;
    // return {
    //   data: null,
    //   error: new AutumnError({
    //     message: "Failed to parse Autumn API response",
    //     code: "internal_error",
    //   }),
    //   statusCode: response?.status,
    // };
  }
};

export type Result<T, E> = Success<T> | Failure<E>;
export type AutumnPromise<T> = Promise<Result<T, AutumnError>>;
