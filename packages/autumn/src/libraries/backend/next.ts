import { findRoute } from "rou3";
import { Autumn } from "../../sdk";

import { NextRequest, NextResponse } from "next/server";
import { AuthResult } from "./utils/AuthFunction";
import { createRouterWithOptions } from "./routes/backendRouter";
import { autumnApiUrl } from "./constants";

export function autumnHandler(options: {
  identify: (request: NextRequest) => AuthResult;
}) {
  const autumn = new Autumn({
    url: autumnApiUrl,
  });

  const router = createRouterWithOptions({
    autumn,
  });

  async function handler(request: NextRequest) {
    const method = request.method;
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);
    const pathname = url.pathname;

    const match = findRoute(router, method, pathname);

    if (!match) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data, params: pathParams } = match;
    const { handler } = data;

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
      getCustomer: async () => await options.identify(request),
      pathParams,
      searchParams,
    });

    return NextResponse.json(result.body, { status: result.statusCode });
  }

  return {
    GET: handler,
    POST: handler,
  };
}
