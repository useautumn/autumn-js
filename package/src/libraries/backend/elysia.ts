import { findRoute } from "rou3";
import { Autumn } from "../../sdk";
import { createRouterWithOptions } from "./routes/backendRouter";
import { AuthResult } from "./utils/AuthFunction";
import { autumnApiUrl } from "./constants";
import { secretKeyCheck } from "./utils/secretKeyCheck";
import type { Elysia, Context } from "elysia";
import { toSnakeCase } from "src/utils/toSnakeCase";

export function autumnHandler<ContextType extends Context = Context>(options: {
  identify: (context: ContextType) => AuthResult | Promise<AuthResult>;
  version?: string;
  secretKey?: string;
  url?: string;
}) {
  const { found, error: resError } = secretKeyCheck(options.secretKey);
  if (!found && !options.secretKey) {
    throw new Error(resError?.message || "Secret key check failed");
  }

  const router = createRouterWithOptions();

  return function plugin(app: Elysia) {
    const autumn = new Autumn({
      url: options.url || autumnApiUrl,
      version: options.version,
      secretKey: options.secretKey,
    });

    app.all("/api/autumn/*", async (context: ContextType) => {
      const request = context.request;
      const url = new URL(request.url);
      const path = url.pathname;
      const searchParams = Object.fromEntries(url.searchParams);
      const method = request.method;

      const match = findRoute(router, method, path);

      if (!match) {
        context.set.status = 404;
        return { error: "Not found" };
      }

      const { data, params: pathParams } = match;
      const { handler } = data;

      // Get the body from context.body instead of parsing it from request
      let body = null;
      if (["POST", "PUT", "PATCH"].includes(method)) {
        body = context.body;
      }

      try {
        const result = await handler({
          autumn,
          body: toSnakeCase(body),
          path,
          getCustomer: async () => await options.identify(context),
          pathParams,
          searchParams,
        });

        context.set.status = result.statusCode;
        return result.body;
      } catch (error: any) {
        context.set.status = 500;
        return {
          error: "Internal server error",
          message: error?.message || "Unknown error",
        };
      }
    });

    return app;
  };
}