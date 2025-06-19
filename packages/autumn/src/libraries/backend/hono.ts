import { findRoute } from "rou3";
import { Autumn } from "../../sdk";
import { createRouterWithOptions } from "./routes/backendRouter";
import { Context, Next } from "hono";
import { AuthResult } from "./utils/AuthFunction";
import { autumnApiUrl } from "./constants";

export const autumnHandler = <ContextType extends Context = Context>(options: {
  identify: (c: ContextType) => AuthResult;
  version?: string;
}) => {
  const autumn = new Autumn({
    url: autumnApiUrl,
    version: options.version,
  });

  const router = createRouterWithOptions({
    autumn,
  });

  return async (c: Context, next: Next) => {
    const request = new URL(c.req.url);
    const path = request.pathname;

    const searchParams = Object.fromEntries(request.searchParams);
    const match = findRoute(router, c.req.method, path);

    if (match) {
      const { data, params: pathParams } = match;
      const { handler } = data;

      let body = null;
      if (c.req.method === "POST") {
        try {
          body = await c.req.json();
        } catch (error) {}
      }

      let result = await handler({
        autumn,
        body,
        path: c.req.path,
        getCustomer: async () => {
          return await options.identify(c as ContextType);
        },
        pathParams,
        searchParams,
      });

      return c.json(result.body, result.statusCode);
    }

    await next();
  };
};
