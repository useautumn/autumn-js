// app/lib/autumn-handler.ts
import { Autumn } from "../../sdk";
import { createRouterWithOptions } from "./routes/backendRouter";
import { findRoute } from "rou3";
import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { AuthResult } from "./utils/AuthFunction";
import { autumnApiUrl } from "./constants";

export function autumnHandler(options: {
  identify: (args: LoaderFunctionArgs | ActionFunctionArgs) => AuthResult;
  version?: string;
}) {
  const autumn = new Autumn({
    url: autumnApiUrl,
    version: options.version,
  });

  const router = createRouterWithOptions({
    autumn,
  });

  // Common handler for both loader and action
  async function handleAutumnRequest(
    args: LoaderFunctionArgs | ActionFunctionArgs
  ) {
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
    loader: async (args: LoaderFunctionArgs) => {
      return handleAutumnRequest(args);
    },

    action: async (args: ActionFunctionArgs) => {
      return handleAutumnRequest(args);
    },
  };
}
