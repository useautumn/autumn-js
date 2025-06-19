import { findRoute } from "rou3";
import { Autumn } from "../../sdk";
import { AuthResult } from "./utils/AuthFunction";
import { createRouterWithOptions } from "./routes/backendRouter";
import { autumnApiUrl } from "./constants";

export function autumnHandler(options: {
  corsHeaders: Record<string, any>;
  identify: (request: Request) => AuthResult;
}) {
  // @ts-ignore
  const secretKey = Deno.env.get("AUTUMN_SECRET_KEY");

  if (!secretKey) {
    throw new Error(
      `AUTUMN_SECRET_KEY not found. Please add it to your secrets in supabase: https://supabase.com/dashboard/project/<PROJECT_ID>/functions/secrets`
    );
  }

  const autumn = new Autumn({
    url: autumnApiUrl,
    secretKey,
  });

  const router = createRouterWithOptions({
    autumn,
  });

  return async function handler(request: Request): Promise<Response> {
    const method = request.method;
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    let pathname = url.pathname;

    if (!pathname.includes("/api/autumn")) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          ...options.corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Extract the part starting from "/api/autumn"
    const autumnIndex = pathname.indexOf("/api/autumn");
    pathname = pathname.substring(autumnIndex);

    const match = findRoute(router, method, pathname);

    if (!match) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          ...options.corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const { data, params: pathParams } = match;
    const { handler: routeHandler } = data;

    let body = null;
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      try {
        body = await request.json();
      } catch (error) {
        // Silently fail if body is not valid JSON
      }
    }

    const result = await routeHandler({
      autumn,
      body,
      path: url.pathname,
      getCustomer: async () => await options.identify(request),
      pathParams,
      searchParams,
    });

    return new Response(JSON.stringify(result.body), {
      status: result.statusCode,
      headers: {
        ...options.corsHeaders,
        "Content-Type": "application/json",
      },
    });
  };
}
