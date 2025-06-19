import { findRoute } from "rou3";
import { Autumn } from "../../sdk";
import { createRouterWithOptions } from "./routes/backendRouter";
import { AuthResult } from "./utils/AuthFunction";
import { autumnApiUrl } from "./constants";
// import { type Request, type Response, type NextFunction } from "express";

// Define middleware types
export type AutumnRequestHandler = (req: any, res: any, next: any) => void;

export type AutumnHandlerOptions = {
  identify: (req: any) => AuthResult;
  autumn?: (req: any) => Autumn | Autumn;
  version?: string;
};

export const autumnHandler = (
  options?: AutumnHandlerOptions
): AutumnRequestHandler => {
  const autumn = new Autumn({
    url: autumnApiUrl,
    version: options?.version,
  });

  const router = createRouterWithOptions({
    autumn,
  });

  return async (req: any, res: any, next: any) => {
    let path = req.path;
    const searchParams = Object.fromEntries(new URLSearchParams(req.query));

    if (!path.startsWith("/api/autumn")) {
      path = "/api/autumn" + path;
    }

    const match = findRoute(router, req.method, path);

    if (match) {
      const { data, params: pathParams } = match;
      const { handler } = data;

      let body = null;
      if (req.method === "POST") {
        try {
          body = req.body;
        } catch (error) {}
      }

      try {
        let autumnClient =
          typeof options?.autumn === "function"
            ? options.autumn(req)
            : options?.autumn || autumn;

        let result = await handler({
          autumn: autumnClient,
          body,
          path: req.path,
          getCustomer: async () => {
            return await options?.identify(req);
          },
          pathParams,
          searchParams,
        });

        return res.status(result.statusCode).json(result.body);
      } catch (error) {
        console.error("Error handling Autumn request:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }

    next();
  };
};
