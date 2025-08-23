import { AuthResult } from "./utils/AuthFunction";
import { createRouterWithOptions } from "./routes/backendRouter";

import { secretKeyCheck } from "./utils/secretKeyCheck";
import { Autumn } from "@sdk";
import { findRoute } from "rou3";

export function autumnHandler(options: {
  httpAction: any;
  identify: (ctx: any, request: any) => AuthResult;
  url?: string;
  secretKey?: string;
}) {
  const router = createRouterWithOptions();

  return options.httpAction(async (ctx: any, request: Request) => {
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard, or passed in as an option
          "Access-Control-Allow-Origin":
            process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
          "Access-Control-Allow-Methods": "POST, GET, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Digest, Authorization, Cookie",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        }),
      });
    }

    let { found, error: resError } = secretKeyCheck(options.secretKey);

    if (!found && !options.secretKey) {
      return Response.json(resError, { status: resError!.statusCode });
    }

    const method = request.method;
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const pathname = url.pathname;
    const match = findRoute(router, method, pathname);

    if (!match) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const { data, params: pathParams } = match;
    const { handler } = data;

    const autumn = new Autumn({
      secretKey: options.secretKey || undefined,
      url: options.url,
    });

    let body = null;
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      try {
        body = await request.json();
      } catch (error) {}
    }

    const result = await handler({
      autumn,
      body,
      path: url.pathname,
      getCustomer: async () => await options.identify(ctx, request),
      pathParams,
      searchParams,
    });

    return Response.json(result.body, {
      status: result.statusCode,
      headers: new Headers({
        "Access-Control-Allow-Origin":
          process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
        Vary: "origin",
      }),
    });
  });
}


export function convexHandler(options: {
  identity: Awaited<AuthResult>;
  url?: string;
  secretKey?: string;
  corsOrigin?: string;
}) {
  const router = createRouterWithOptions();

  // CORS headers, can be customized or made configurable if needed
  const corsHeaders = {
    "Access-Control-Allow-Origin": options.corsOrigin ?? process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
    "Access-Control-Allow-Methods": "POST, GET, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };

  return async (ctx: any, request: Request) => {
    const headers = request.headers;

    // Handle CORS preflight (OPTIONS) requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: new Headers(corsHeaders),
      });
    }

    let { found, error: resError } = secretKeyCheck(options.secretKey);

    if (!found && !options.secretKey) {
      return new Response(JSON.stringify(resError), {
        status: resError!.statusCode,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const method = request.method;
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const pathname = url.pathname;
    const match = findRoute(router, method, pathname);

    if (!match) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    const { data, params: pathParams } = match;
    const { handler } = data;

    const autumn = new Autumn({
      secretKey: options.secretKey || undefined,
      url: options.url,
    });

    let body = null;
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      try {
        body = await request.json();
      } catch (error) {}
    }

    try {
      console.log("Identity in convex.ts:", options.identity);
      const result = await handler({
        autumn,
        body,
        path: url.pathname,
        getCustomer: async () => options.identity,
        pathParams,
        searchParams,
      });

      return new Response(JSON.stringify(result.body), {
        status: result.statusCode,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  };
}
