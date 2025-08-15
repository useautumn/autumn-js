import { findRoute } from "rou3";
import { Autumn } from "../../sdk";
import { createRouterWithOptions } from "./routes/backendRouter";
import { AuthResult } from "./utils/AuthFunction";
import { autumnApiUrl } from "./constants";
import { secretKeyCheck } from "./utils/secretKeyCheck";
import { defineEventHandler, createError, readBody, H3Event, getRequestURL } from "h3";

export function autumnHandler(options: {
  identify: (event: H3Event) => AuthResult | Promise<AuthResult>;
  version?: string;
  secretKey?: string;
  url?: string;
}) {
  const { found, error: resError } = secretKeyCheck(options.secretKey);
  if (!found && !options.secretKey) {
    throw new Error(resError?.message || "Secret key check failed");
  }

  const autumn = new Autumn({
    url: options.url || autumnApiUrl,
    version: options.version,
    secretKey: options.secretKey,
  });

  const router = createRouterWithOptions();

  return defineEventHandler(async (event) => {
    let { found, error: resError } = secretKeyCheck(options.secretKey);
    if (!found && !options.secretKey) {
      throw createError({
        statusCode: resError!.statusCode,
        statusMessage: resError!.message,
        data: resError,
      });
    }

    const method = event.method;
    const url = getRequestURL(event);
    const path = url.pathname;
    const searchParams = Object.fromEntries(url.searchParams);

    const match = findRoute(router, method, path);

    if (!match) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        data: { error: "Not found" },
      });
    }

    const { data, params: pathParams } = match;
    const { handler } = data;

    let body = null;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        body = await readBody(event);
      } catch (error) {
        body = null;
      }
    }

    try {
      const result = await handler({
        autumn,
        body,
        path,
        getCustomer: async () => await options.identify(event),
        pathParams,
        searchParams,
      });

      if (result.statusCode >= 400) {
        throw createError({
          statusCode: result.statusCode,
          statusMessage: result.body.message || "Error",
          data: result.body,
        });
      }

      return result.body;
    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Server Error",
        data: {
          error: "Internal server error",
          message: error?.message || "Unknown error",
        },
      });
    }
  });
}
