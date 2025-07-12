import { Autumn } from "../../sdk";
import { createRouterWithOptions } from "./routes/backendRouter";
import { findRoute } from "rou3";
import { AuthResult } from "./utils/AuthFunction";
import { autumnApiUrl } from "./constants";

export function autumnHandler(options: {
  secretKey?: string;
  identify: (args: {
    request: Request;
    params: Record<string, string>;
  }) => AuthResult;
  version?: string;
}) {
  const autumn = new Autumn({
    url: autumnApiUrl,
    version: options.version,
  });

  const router = createRouterWithOptions();

  // Common handler for both loader and action
  async function handleAutumnRequest(args: {
    request: Request;
    params: Record<string, string>;
  }) {
    let path = args.params["*"] || "";

    const url = new URL(args.request.url);
    const pathname = url.pathname;
    const searchParams = Object.fromEntries(url.searchParams);

    const match = findRoute(router, args.request.method, pathname);

    if (!match) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, params: pathParams } = match;
    const { handler } = data;

    let body = null;
    if (args.request.method !== "GET") {
      try {
        body = await args.request.json();
      } catch (error) {}
    }

    const result = await handler({
      autumn,
      body,
      path,
      getCustomer: async () => {
        return await options.identify(args);
      },
      pathParams,
      searchParams,
    });

    return new Response(JSON.stringify(result.body), {
      status: result.statusCode,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Return loader and action that both use the common handler
  return {
    loader: async (args: any) => {
      return handleAutumnRequest(args);
    },

    action: async (args: any) => {
      return handleAutumnRequest(args);
    },
  };
}
