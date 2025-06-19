import { findRoute } from "rou3";
import { Autumn } from "../../sdk";
import { autumnApiUrl } from "./constants";
import { createRouterWithOptions } from "./routes/backendRouter";
import { AuthResult } from "./utils/AuthFunction";
import { json } from "@tanstack/react-start";

// Create a factory function for your Autumn handler
export const autumnHandler = (options: {
  identify: (ctx: { request: any }) => AuthResult;
  version?: string;
}) => {
  const autumn = new Autumn({
    url: autumnApiUrl,
    version: options.version,
  });

  const router = createRouterWithOptions({
    autumn,
  });

  // Generic handler function that works with any HTTP method
  const handleRequest = async (ctx: { request: Request; params: any }) => {
    const { request } = ctx;

    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const pathname = url.pathname;

    const method = request.method;
    const match = findRoute(router, method, pathname);

    if (!match) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, params: pathParams } = match;
    const { handler } = data;

    let body = null;
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      try {
        body = await request.json();
      } catch (error) {
        // Handle JSON parsing errors
      }
    }

    try {
      const result = await handler({
        autumn,
        body,
        path: pathname,
        getCustomer: async () => await options.identify(ctx),
        pathParams,
        searchParams,
      });

      return json(result.body, { status: result.statusCode });
    } catch (error: any) {
      console.error("Autumn handler error:", error.message);
      return json({ error: error.message }, { status: 500 });
    }
  };

  // Return handlers for supported HTTP methods
  return {
    GET: handleRequest,
    POST: handleRequest,
    PUT: handleRequest,
    PATCH: handleRequest,
    DELETE: handleRequest,
  };
};
